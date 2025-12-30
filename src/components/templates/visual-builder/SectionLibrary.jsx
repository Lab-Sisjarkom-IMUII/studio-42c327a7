"use client";

import { motion } from 'framer-motion';
import { Plus, Layout } from 'lucide-react';
import { SECTION_PRESETS, getAvailableSectionTypes } from './SectionPresets';

/**
 * Section item untuk library (click to add)
 */
function SectionItem({ type, preset, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(type)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full glass rounded-xl p-4 border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all text-left"
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-white mb-1">{preset.name}</h3>
          <p className="text-xs text-zinc-400">
            {preset.layouts.length} gaya tersedia
          </p>
        </div>
        <Plus size={16} className="text-zinc-400" />
      </div>
    </motion.button>
  );
}


/**
 * Section Library Component
 * Sidebar untuk memilih section (click untuk pilih layout)
 */
export function SectionLibrary({ onSectionClick }) {
  const sectionTypes = getAvailableSectionTypes();

  return (
    <div className="h-full flex flex-col bg-[--background] border-r border-white/10">
      {/* Header */}
      <div className="glass border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Layout size={16} className="text-primary" />
          <h2 className="font-semibold text-sm text-white">Section Library</h2>
        </div>
        <p className="text-xs text-zinc-400 mt-1">Klik untuk menambahkan section</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase mb-2">Available Sections</h3>
            <p className="text-xs text-zinc-500">Pilih section untuk melihat pilihan gaya</p>
          </div>
          {sectionTypes.map((type) => {
            const preset = SECTION_PRESETS[type];
            if (!preset) return null;

            return (
              <SectionItem
                key={type}
                type={type}
                preset={preset}
                onClick={onSectionClick}
              />
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="glass border-t border-white/10 px-4 py-3">
        <p className="text-xs text-zinc-400 text-center">
          {sectionTypes.length} section types available
        </p>
      </div>
    </div>
  );
}
