"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, Loader2, CheckCircle, AlertCircle, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { RippleButton } from "@/components/ripple-button";
import { SidebarTools } from "@/components/templates/upload/SidebarTools";
import { TemplateEditor } from "@/components/templates/upload/TemplateEditor";
import { TemplatePreview } from "@/components/templates/upload/TemplatePreview";
import { generateFieldsFromTemplate } from "@/lib/template-utils";
import { fillTemplate, generateDummyData, renderTemplateWithSections } from "@/lib/template-filler";
import { parseTemplate } from "@/lib/template-parser";
import { templates as templatesApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { uploadTemplateThumbnail } from "@/services/uploadService";

export default function CreateTemplatePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [htmlTemplate, setHtmlTemplate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [parsingResult, setParsingResult] = useState(null);
  const [scrollToLine, setScrollToLine] = useState(null);
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const debounceTimerRef = useRef(null);
  const parsingTimerRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // Real-time parsing dengan debounce yang lebih baik untuk template besar
  useEffect(() => {
    if (parsingTimerRef.current) {
      clearTimeout(parsingTimerRef.current);
    }

    // Dynamic debounce: lebih lama untuk template besar
    const templateSize = htmlTemplate.length;
    const debounceTime = templateSize > 50000 ? 1000 : templateSize > 20000 ? 600 : 300;

    parsingTimerRef.current = setTimeout(() => {
      if (htmlTemplate && htmlTemplate.trim()) {
        // Gunakan setTimeout untuk tidak memblokir UI thread
        setTimeout(() => {
          try {
            const result = parseTemplate(htmlTemplate);
            setParsingResult(result);
          } catch (error) {
            console.error("Parsing error:", error);
            setParsingResult({
              sections: [],
              headContent: "",
              bodyAttributes: "",
              warnings: [],
              errors: [error.message || "Failed to parse template"],
            });
          }
        }, 0);
      } else {
        setParsingResult(null);
      }
    }, debounceTime);

    return () => {
      if (parsingTimerRef.current) {
        clearTimeout(parsingTimerRef.current);
      }
    };
  }, [htmlTemplate]);

  // Generate preview dengan dummy data - menggunakan useRef untuk menghindari dependency loop
  const generatePreviewRef = useRef(null);
  
  // Update ref setiap kali htmlTemplate berubah
  useEffect(() => {
    generatePreviewRef.current = () => {
      if (!htmlTemplate.trim()) {
        setPreviewHtml("");
        return;
      }

      setIsGeneratingPreview(true);
      
      // Gunakan setTimeout untuk tidak memblokir UI thread, terutama untuk template besar
      setTimeout(() => {
        try {
          const fields = generateFieldsFromTemplate(htmlTemplate);
          const dummyData = generateDummyData(fields);

          let filled = "";

          try {
            // Untuk template besar, skip parsing sections dan langsung gunakan fillTemplate
            const templateSize = htmlTemplate.length;
            if (templateSize > 100000) {
              // Template terlalu besar, langsung fill tanpa parsing sections
              filled = fillTemplate(htmlTemplate, dummyData);
            } else {
              const parsed = parseTemplate(htmlTemplate);

              if (parsed.sections && parsed.sections.length > 0) {
                const templateObj = {
                  headContent: parsed.headContent || "",
                  bodyAttributes: parsed.bodyAttributes || "",
                };

                filled = renderTemplateWithSections(parsed.sections, dummyData, {}, templateObj);
              } else {
                filled = fillTemplate(htmlTemplate, dummyData);
              }
            }
          } catch (parseError) {
            console.warn("Template parsing failed, using fallback:", parseError.message);
            filled = fillTemplate(htmlTemplate, dummyData);
          }

          setPreviewHtml(filled);
        } catch (err) {
          console.error("Error generating preview:", err);
          setError("Error generating preview: " + err.message);
        } finally {
          setIsGeneratingPreview(false);
        }
      }, 0);
    };
  }, [htmlTemplate]);

  // Stable function untuk manual refresh (tidak berubah setiap render)
  const generatePreview = useCallback(() => {
    if (generatePreviewRef.current) {
      generatePreviewRef.current();
    }
  }, []);

  // Debounced auto-preview dengan debounce dinamis berdasarkan ukuran template
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (htmlTemplate.trim()) {
      // Dynamic debounce: lebih lama untuk template besar
      const templateSize = htmlTemplate.length;
      const debounceTime = templateSize > 50000 ? 1500 : templateSize > 20000 ? 800 : 500;
      
      debounceTimerRef.current = setTimeout(() => {
        if (generatePreviewRef.current) {
          generatePreviewRef.current();
        }
      }, debounceTime);
    } else {
      setPreviewHtml("");
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [htmlTemplate]);

  // Handle thumbnail file select
  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setThumbnailFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle remove thumbnail
  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!name.trim() || !htmlTemplate.trim()) {
      setError("Nama dan template HTML diperlukan");
      return;
    }

    if (!isAuthenticated) {
      setError("Anda harus login untuk menyimpan template");
      router.push("/login");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      let finalThumbnailUrl = null;

      // Upload thumbnail if selected
      if (thumbnailFile) {
        setIsUploadingThumbnail(true);
        console.log("📤 [CreateTemplate] Uploading thumbnail...");
        
        const uploadResult = await uploadTemplateThumbnail(thumbnailFile, null);
        
        if (uploadResult.success) {
          finalThumbnailUrl = uploadResult.url;
          console.log("✅ [CreateTemplate] Upload successful:", finalThumbnailUrl);
        } else {
          throw new Error(uploadResult.error || "Failed to upload thumbnail");
        }
        
        setIsUploadingThumbnail(false);
      }

      // Generate fields from template
      const fieldsArray = generateFieldsFromTemplate(htmlTemplate);
      
      // Convert fields array to map/object (backend expects map[string]interface{}, not array)
      const fieldsMap = fieldsArray.reduce((acc, field) => {
        acc[field.key] = {
          type: field.type,
          label: field.label,
          required: field.required || false,
          description: field.description || null,
        };
        return acc;
      }, {});
      
      // Prepare sections from parsing result
      const sections = parsingResult?.sections?.map((section, index) => ({
        type: section.type || "custom",
        name: section.name || `Section ${index + 1}`,
        html_content: section.htmlContent || section.html || "",
        order: section.order || index + 1,
        is_optional: section.isOptional || false,
        condition: section.condition || null,
      })) || [];

      // Create template via API
      const result = await templatesApi.createTemplate({
        name: name.trim(),
        description: description.trim() || undefined,
        html_template: htmlTemplate,
        thumbnail_url: finalThumbnailUrl || undefined,
        fields: fieldsMap, // Send as object/map, not array
        sections: sections.length > 0 ? sections : undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/my-templates");
        }, 2000);
      } else {
        throw new Error(result.message || "Gagal menyimpan template");
      }
    } catch (err) {
      console.error("Error saving template:", err);
      setError(err.message || err.error || "Terjadi kesalahan saat menyimpan template");
      setIsUploadingThumbnail(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading if checking auth
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen pt-16 flex flex-col">
      {/* Top Bar */}
      <div className="glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-white/5 transition"
          >
            <ArrowLeft size={20} className="text-zinc-400" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Upload Custom Template</h1>
            <p className="text-sm text-zinc-400">Create and validate your portfolio template</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Template Info Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template name..."
              className="px-4 py-2 rounded-lg bg-[--muted] border border-[--border] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder-zinc-500 transition-all text-sm w-48"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)..."
              className="px-4 py-2 rounded-lg bg-[--muted] border border-[--border] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder-zinc-500 transition-all text-sm w-64"
            />
          </div>

          {/* Thumbnail Upload */}
          <div className="flex items-center gap-2">
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleThumbnailSelect}
              className="hidden"
              id="thumbnail-upload"
              disabled={isSaving || isUploadingThumbnail}
            />
            <label
              htmlFor="thumbnail-upload"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[--muted] border border-[--border] hover:bg-[--card] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ImageIcon size={16} className="text-primary" />
              <span className="text-white">{thumbnailFile ? "Change" : "Thumbnail"}</span>
            </label>
            
            {/* Thumbnail Preview */}
            {thumbnailPreview && (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  className="absolute top-0 right-0 p-1 bg-red-500/80 hover:bg-red-500 rounded-bl-lg transition-colors"
                  disabled={isSaving || isUploadingThumbnail}
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            )}
          </div>

          <RippleButton
            onClick={handleSave}
            disabled={isSaving || isUploadingThumbnail || !name.trim() || !htmlTemplate.trim()}
            className="px-4 py-2 rounded-lg bg-primary hover:opacity-90 text-primary-foreground font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving || isUploadingThumbnail ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{isUploadingThumbnail ? "Uploading..." : "Saving..."}</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Template</span>
              </>
            )}
          </RippleButton>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mt-4 glass rounded-xl p-4 border border-green-500/30 bg-green-500/10"
        >
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-400 mb-1">Template Berhasil Disimpan!</h3>
              <p className="text-sm text-zinc-400">Mengarahkan ke dashboard...</p>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mt-4 glass rounded-xl p-4 border border-red-500/30 bg-red-500/10"
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-400 mb-1">Error</h3>
              <p className="text-sm text-zinc-400">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Area - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tools */}
        <SidebarTools 
          parsingResult={parsingResult} 
          htmlTemplate={htmlTemplate}
          onSectionClick={(line, section) => {
            setScrollToLine(line);
            setHighlightedSection(section);
            setTimeout(() => {
              setHighlightedSection(null);
            }, 3000);
          }}
        />

        {/* Editor (Left) */}
        <div className="flex-1 flex flex-col border-r border-white/10">
          <TemplateEditor
            value={htmlTemplate}
            onChange={setHtmlTemplate}
            errors={parsingResult?.errors || []}
            scrollToLine={scrollToLine}
            highlightedSection={highlightedSection}
          />
        </div>

        {/* Preview (Right) */}
        <div className="flex-1 flex flex-col">
          <TemplatePreview
            htmlContent={previewHtml}
            isGenerating={isGeneratingPreview}
            onRefresh={generatePreview}
            highlightedSection={highlightedSection}
          />
        </div>
      </div>
    </div>
  );
}
