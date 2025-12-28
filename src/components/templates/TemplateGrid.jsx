"use client";

import { TemplateCard } from "./TemplateCard";

export function TemplateGrid({ templates }) {
  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">Tidak ada template ditemukan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}

