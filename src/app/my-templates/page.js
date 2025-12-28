"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Filter, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { templates as templatesApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function MyTemplatesPage() {
  const router = useRouter();
  const { uploader, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Load user templates
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadTemplates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await templatesApi.getTemplates({ page: 1, limit: 100 });
        if (result.success && result.data?.templates) {
          // Filter only templates owned by current uploader
          const userTemplates = result.data.templates.filter(
            (template) => template.uploader_id === uploader?.id
          );
          setTemplates(userTemplates);
        }
      } catch (err) {
        console.error("Error loading templates:", err);
        setError(err.message || "Gagal memuat templates");
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [isAuthenticated, uploader]);

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    return (
      template.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === "name") {
      return (a.name || "").localeCompare(b.name || "");
    }
    return 0;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Templates</h1>
            <p className="text-zinc-400">
              Kelola template yang telah Anda buat untuk imuii.id
            </p>
          </div>
          <Link href="/create">
            <Button variant="accent">
              <Plus size={20} className="mr-2" />
              Buat Template Baru
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="glass rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
              <Input
                type="text"
                placeholder="Cari template Anda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="name">Nama A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid or Empty State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="glass rounded-xl p-8 border border-red-500/30 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : sortedTemplates.length > 0 ? (
          <TemplateGrid templates={sortedTemplates} />
        ) : (
          <div className="glass rounded-xl p-12 border border-white/10 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Belum Ada Template
              </h3>
              <p className="text-zinc-400 mb-6">
                Mulai membuat template pertama Anda dan bagikan dengan komunitas
              </p>
              <Link href="/create">
                <Button variant="accent">
                  <Plus size={20} className="mr-2" />
                  Buat Template Pertama
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

