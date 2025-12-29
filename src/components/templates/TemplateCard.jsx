"use client";

import Link from "next/link";
import { Eye, Download, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// Helper function untuk format date
function getRelativeTime(dateString) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  return date.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
}

export function TemplateCard({ template }) {
  // Handle both API format and mock format
  const templateName = template.name || "Untitled Template";
  const templateDescription = template.description || "";
  const templateId = template.id;
  const createdAt = template.created_at || template.createdAt;
  const thumbnailUrl = template.thumbnail_url || template.previewImage || "https://via.placeholder.com/400x300/7C3AED/ffffff?text=Template";
  
  // Get owner info
  const owner = template.uploader || template.user || template.author;
  const ownerName = owner?.name || owner?.username || "Unknown";
  const ownerType = template.owner_type || (template.uploader ? "uploader" : template.user ? "user" : "default");

  return (
    <Card className="group hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
      <div className="relative w-full h-48 overflow-hidden bg-[--muted]">
        <img
          src={thumbnailUrl}
          alt={templateName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {templateId && (
            <Link href={`/templates/${templateId}`} className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                <Eye size={16} className="mr-2" />
                Preview
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
            {templateName}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-2">
            {templateDescription}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={12} className="text-primary" />
          </div>
          <span className="text-xs text-zinc-400">{ownerName}</span>
          {ownerType && ownerType !== "default" && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
              {ownerType}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{getRelativeTime(createdAt)}</span>
          </div>
        </div>

        {template.sections && template.sections.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-white/10">
            {template.sections.slice(0, 3).map((section, idx) => (
              <span
                key={section.id || idx}
                className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary border border-primary/30"
              >
                {section.type || section.name}
              </span>
            ))}
            {template.sections.length > 3 && (
              <span className="px-2 py-0.5 rounded text-xs text-zinc-400">
                +{template.sections.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

