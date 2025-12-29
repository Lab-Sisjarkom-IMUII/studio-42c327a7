"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle, Eye } from "lucide-react";
import { getPublicTemplateById } from "@/lib/api/templates";
import { generateDummyData, fillTemplate, renderTemplateWithSections } from "@/lib/template-filler";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function TemplatePreviewPage() {
  const params = useParams();
  const templateId = params?.id;
  
  const [template, setTemplate] = useState(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) {
        setError("Template ID tidak ditemukan");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch template dari API
        const result = await getPublicTemplateById(templateId);
        
        if (!result.success || !result.data) {
          throw new Error(result.message || "Template tidak ditemukan");
        }

        const templateData = result.data;
        setTemplate(templateData);

        // Generate dummy data
        const dummyData = generateDummyData(templateData.fields || {});

        // Render preview HTML
        let html = "";

        // Jika template menggunakan sections (modular approach)
        if (templateData.sections && templateData.sections.length > 0) {
          // Transform sections dari API format (snake_case) ke camelCase jika perlu
          const sections = templateData.sections.map((section) => ({
            id: section.id,
            type: section.type,
            name: section.name,
            htmlContent: section.html_content || section.htmlContent || "",
            order: section.order || 0,
            isOptional: section.is_optional !== undefined ? section.is_optional : section.isOptional || false,
          }));

          html = renderTemplateWithSections(sections, dummyData, {
            includeWrapper: true,
          }, templateData);
        } else if (templateData.html_template || templateData.htmlTemplate) {
          // Fallback ke htmlTemplate jika sections tidak ada
          const htmlTemplate = templateData.html_template || templateData.htmlTemplate;
          html = fillTemplate(htmlTemplate, dummyData);
          
          // Jika HTML tidak memiliki wrapper, tambahkan
          if (!html.includes("<!DOCTYPE html>")) {
            html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateData.name || "Template Preview"}</title>
  <link rel="icon" href="/MainLogo.png" type="image/png" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
${html}
</body>
</html>`;
          }
        } else {
          throw new Error("Template tidak memiliki content");
        }

        setPreviewHtml(html);
      } catch (err) {
        console.error("Error loading template:", err);
        setError(err.message || "Gagal memuat template");
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--background]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground">Memuat preview template...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--background] px-4">
        <div className="glass rounded-xl p-8 border border-red-500/30 text-center max-w-md">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Error</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Link href="/">
            <Button variant="primary">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!previewHtml) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--background]">
        <div className="text-center">
          <AlertCircle size={48} className="text-yellow-400 mx-auto mb-4" />
          <p className="text-foreground">Preview tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--background]">
      {/* Header dengan info template */}
      <div className="sticky top-0 z-10 glass border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {template?.name || "Template Preview"}
            </h1>
            {template?.description && (
              <p className="text-sm text-zinc-400 line-clamp-1">
                {template.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                Kembali
              </Button>
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30">
              <Eye size={16} className="text-primary" />
              <span className="text-sm text-primary font-medium">Preview Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="w-full">
        <iframe
          srcDoc={previewHtml}
          className="w-full h-screen border-0"
          title="Template Preview"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  );
}

