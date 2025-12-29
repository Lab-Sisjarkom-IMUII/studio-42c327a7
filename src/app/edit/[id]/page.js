"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { TemplateValidator } from "@/components/templates/TemplateValidator";
import { templates as templatesApi } from "@/lib/api";
import { parseTemplate } from "@/lib/template-parser";
import { uploadTemplateThumbnail } from "@/services/uploadService";
import { useAuth } from "@/hooks/useAuth";

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const templateId = params.id;

  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
  });
  const [htmlTemplate, setHtmlTemplate] = useState("");
  const [parsingResult, setParsingResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const thumbnailInputRef = useRef(null);

  // Load template data
  useEffect(() => {
    const loadTemplate = async () => {
      if (!isAuthenticated || authLoading) return;
      
      setLoading(true);
      try {
        const result = await templatesApi.getTemplateById(templateId);
        if (result.success && result.data) {
          const templateData = result.data;
          setTemplate(templateData);
          setFormData({
            name: templateData.name || "",
            description: templateData.description || "",
            tags: "", // Tags tidak ada di API response
          });
          setHtmlTemplate(templateData.html_template || "");
          
          // Load existing thumbnail
          if (templateData.thumbnail_url) {
            setThumbnailPreview(templateData.thumbnail_url);
          }
          
          // Parse template
          if (templateData.html_template) {
            try {
              const parsed = parseTemplate(templateData.html_template);
              setParsingResult(parsed);
            } catch (parseError) {
              console.warn("Failed to parse template:", parseError);
            }
          }
        } else {
          setErrors({ general: "Template tidak ditemukan" });
        }
      } catch (err) {
        console.error("Error loading template:", err);
        setErrors({ general: err.message || "Gagal memuat template" });
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId, isAuthenticated, authLoading]);

  const handleTextChange = (e) => {
    const content = e.target.value;
    setHtmlTemplate(content);
    if (content.trim()) {
      const result = parseTemplate(content);
      setParsingResult(result);
    } else {
      setParsingResult(null);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama template wajib diisi";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi";
    }

    if (!htmlTemplate.trim()) {
      newErrors.template = "Template HTML wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle thumbnail file select
  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, thumbnail: `Invalid file type. Allowed: ${allowedTypes.join(", ")}` });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({ ...errors, thumbnail: "File size exceeds 5MB limit" });
      return;
    }

    setThumbnailFile(file);
    setErrors({ ...errors, thumbnail: null });

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
    // Keep existing URL if available
    if (template?.thumbnail_url) {
      setThumbnailPreview(template.thumbnail_url);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!isAuthenticated) {
      setErrors({ general: "Anda harus login untuk menyimpan template" });
      router.push("/login");
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      let finalThumbnailUrl = null;

      // Upload thumbnail if new file selected
      if (thumbnailFile) {
        setIsUploadingThumbnail(true);
        console.log("📤 [EditTemplate] Uploading thumbnail...");
        
        const uploadResult = await uploadTemplateThumbnail(thumbnailFile, templateId);
        
        if (uploadResult.success) {
          finalThumbnailUrl = uploadResult.url;
          console.log("✅ [EditTemplate] Upload successful:", finalThumbnailUrl);
        } else {
          throw new Error(uploadResult.error || "Failed to upload thumbnail");
        }
        
        setIsUploadingThumbnail(false);
      } else if (template?.thumbnail_url && !thumbnailFile) {
        // Keep existing thumbnail if no new file uploaded
        finalThumbnailUrl = template.thumbnail_url;
      }

      // Update template via API
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        html_template: htmlTemplate,
      };

      // Only include thumbnail_url if we have a value
      if (finalThumbnailUrl) {
        updateData.thumbnail_url = finalThumbnailUrl;
      }

      const result = await templatesApi.updateTemplate(templateId, updateData);

      if (result.success) {
        router.push("/my-templates");
      } else {
        throw new Error(result.message || "Gagal menyimpan template");
      }
    } catch (err) {
      console.error("Error saving template:", err);
      setErrors({ general: err.message || err.error || "Terjadi kesalahan saat menyimpan template" });
      setIsUploadingThumbnail(false);
    } finally {
      setSaving(false);
    }
  };

  // Show loading if checking auth or loading template
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!template && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">{errors.general || "Template tidak ditemukan"}</p>
          <Link href="/my-templates">
            <Button variant="outline">Kembali ke My Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/my-templates">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} className="mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Template</h1>
          <p className="text-zinc-400">
            Edit template Anda untuk imuii.id dan simpan perubahan
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Template</CardTitle>
              <CardDescription>
                Edit informasi dasar tentang template Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Nama Template"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                required
              />

              <Textarea
                label="Deskripsi"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                error={errors.description}
                rows={4}
                required
              />

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Thumbnail (Optional)
                </label>
                
                {/* Preview */}
                {thumbnailPreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded transition-colors"
                      disabled={saving || isUploadingThumbnail}
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                )}
                
                {/* File Input */}
                <div className="flex items-center gap-3">
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleThumbnailSelect}
                    className="hidden"
                    id="thumbnail-upload"
                    disabled={saving || isUploadingThumbnail}
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[--muted] border border-[--border] hover:bg-[--card] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <ImageIcon size={16} className="text-primary" />
                    <span className="text-white">{thumbnailFile ? "Change Thumbnail" : "Upload Thumbnail"}</span>
                  </label>
                  
                  {isUploadingThumbnail && (
                    <span className="text-sm text-primary flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Uploading...
                    </span>
                  )}
                </div>
                
                {errors.thumbnail && (
                  <p className="text-sm text-red-400">{errors.thumbnail}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template HTML</CardTitle>
              <CardDescription>
                Edit kode HTML template Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                label="HTML Template"
                value={htmlTemplate}
                onChange={handleTextChange}
                error={errors.template}
                rows={12}
                className="font-mono text-sm"
                required
              />
            </CardContent>
          </Card>

          {parsingResult && (
            <TemplateValidator
              htmlTemplate={htmlTemplate}
              parsingResult={parsingResult}
            />
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="rounded-lg p-4 border border-red-500/30 bg-red-500/10">
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="accent"
              className="flex-1"
              loading={saving || isUploadingThumbnail}
              disabled={saving || isUploadingThumbnail}
            >
              {saving || isUploadingThumbnail ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  {isUploadingThumbnail ? "Uploading..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
            <Link href="/my-templates">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

