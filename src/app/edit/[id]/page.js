"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { TemplateValidator } from "@/components/templates/TemplateValidator";
import { getTemplateById } from "@/lib/mock-data";
import { parseTemplate } from "@/lib/template-parser";

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
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

  useEffect(() => {
    // Load template data (mock)
    const templateData = getTemplateById(templateId);
    if (templateData) {
      setTemplate(templateData);
      setFormData({
        name: templateData.name,
        description: templateData.description,
        tags: templateData.tags.join(", "),
      });
      // Mock: Load HTML template (dalam real app, ini akan dari API)
      setHtmlTemplate("<!-- Mock HTML template -->");
      const result = parseTemplate("<!-- Mock HTML template -->");
      setParsingResult(result);
    }
  }, [templateId]);

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

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSaving(true);
    // Mock: Simulasi save
    setTimeout(() => {
      setSaving(false);
      console.log("Template saved:", {
        ...formData,
        htmlTemplate,
        parsingResult,
      });
      // TODO: Integrasi dengan backend
      router.push("/my-templates");
    }, 1000);
  };

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Template tidak ditemukan</p>
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

              <Input
                label="Tags (pisahkan dengan koma)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
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

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="accent"
              className="flex-1"
              loading={saving}
            >
              <Save size={20} className="mr-2" />
              Simpan Perubahan
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

