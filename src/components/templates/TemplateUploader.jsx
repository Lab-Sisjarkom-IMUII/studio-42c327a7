"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { TemplateValidator } from "./TemplateValidator";
import { parseTemplate } from "@/lib/template-parser";

export function TemplateUploader({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
  });
  const [htmlTemplate, setHtmlTemplate] = useState("");
  const [parsingResult, setParsingResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".html")) {
      setErrors({ file: "File harus berformat .html" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setHtmlTemplate(content);
      // Auto-parse template
      const result = parseTemplate(content);
      setParsingResult(result);
    };
    reader.readAsText(file);
  };

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
    } else if (parsingResult && parsingResult.errors.length > 0) {
      newErrors.template = "Template memiliki error. Silakan perbaiki terlebih dahulu.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    // Mock: Simulasi submit
    setTimeout(() => {
      setLoading(false);
      if (onSubmit) {
        onSubmit({
          ...formData,
          htmlTemplate,
          parsingResult,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        });
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Template</CardTitle>
          <CardDescription>
            Masukkan informasi dasar tentang template Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nama Template"
            placeholder="Contoh: Modern Portfolio"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <Textarea
            label="Deskripsi"
            placeholder="Jelaskan template Anda..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
            rows={4}
            required
          />

          <Input
            label="Tags (pisahkan dengan koma)"
            placeholder="portfolio, modern, glass"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            helperText="Gunakan tag untuk memudahkan pencarian"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Template HTML</CardTitle>
          <CardDescription>
            Upload file HTML atau paste kode HTML template Anda untuk imuii.id
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".html"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload size={20} className="mr-2" />
              Upload File HTML
            </Button>
          </div>

          <div className="relative">
            <Textarea
              label="Atau Paste HTML Template"
              placeholder="Paste kode HTML template Anda di sini..."
              value={htmlTemplate}
              onChange={handleTextChange}
              error={errors.template}
              rows={12}
              className="font-mono text-sm"
            />
            {htmlTemplate && (
              <button
                type="button"
                onClick={() => {
                  setHtmlTemplate("");
                  setParsingResult(null);
                }}
                className="absolute top-9 right-3 p-1 rounded hover:bg-white/5 text-zinc-400 hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {parsingResult && (
        <TemplateValidator
          htmlTemplate={htmlTemplate}
          parsingResult={parsingResult}
        />
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="accent"
          className="flex-1"
          loading={loading}
        >
          Upload Template
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({ name: "", description: "", tags: "" });
            setHtmlTemplate("");
            setParsingResult(null);
            setErrors({});
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}

