"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { templates as templatesApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load templates from API (PUBLIC endpoint - tidak perlu auth)
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Gunakan public endpoint yang tidak memerlukan authentication
        const result = await templatesApi.getPublicTemplates({ page: 1, limit: 100 });
        if (result.success && result.data?.templates) {
          setTemplates(result.data.templates);
        }
      } catch (err) {
        console.error("Error loading templates:", err);
        setError(err.message || "Gagal memuat templates");
        // Set empty array on error
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filtering bisa ditambahkan nanti jika ada field category di template
    return matchesSearch;
  });

  const categories = [
    { id: "all", name: "All Templates", count: templates.length },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
              studio.imuii.id
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Jelajahi koleksi template portfolio dan CV berkualitas tinggi untuk <a href="https://imuii.id" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">imuii.id</a>.
            Buat, upload, dan bagikan template Anda dengan komunitas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button variant="accent" size="lg">
                Buat Template
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" size="lg">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
              <Input
                type="text"
                placeholder="Cari template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-black/40 text-foreground hover:bg-white/5"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Template Terbaru
          </h2>
          <span className="text-sm text-zinc-400">
            {isLoading ? "Memuat..." : `${filteredTemplates.length} template ditemukan`}
          </span>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="glass rounded-xl p-8 border border-red-500/30 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-sm text-zinc-400">
              Gagal memuat templates. Silakan refresh halaman atau coba lagi nanti.
            </p>
          </div>
        ) : filteredTemplates.length > 0 ? (
          <TemplateGrid templates={filteredTemplates} />
        ) : (
          <div className="glass rounded-xl p-12 border border-white/10 text-center">
            <p className="text-zinc-400">Tidak ada template ditemukan</p>
          </div>
        )}
      </section>
    </div>
  );
}
