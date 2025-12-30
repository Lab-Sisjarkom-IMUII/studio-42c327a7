"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { getSectionPreset, getSectionTemplate } from './SectionPresets';

/**
 * Layout Selector Modal
 * Modal untuk memilih layout/gaya section saat ditambahkan
 */
export function LayoutSelector({ 
  sectionType, 
  isOpen, 
  onClose, 
  onSelectLayout 
}) {
  if (!isOpen || !sectionType) return null;

  const preset = getSectionPreset(sectionType);
  if (!preset) return null;

  const layouts = preset.layouts || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg text-white">
                    Pilih Gaya {preset.name}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Pilih salah satu gaya layout untuk section ini
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 transition text-zinc-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Layout Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {layouts.map((layout) => {
                    const layoutName = layout
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    
                    const template = getSectionTemplate(sectionType, layout);
                    const preview = template ? template.substring(0, 150) + '...' : '';

                    return (
                      <motion.button
                        key={layout}
                        onClick={() => {
                          onSelectLayout(layout);
                          onClose();
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="glass rounded-xl p-4 border border-white/10 hover:border-primary/50 hover:bg-white/5 transition text-left group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-sm text-white">
                            {layoutName}
                          </h3>
                          {layout === preset.defaultLayout && (
                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                              Default
                            </span>
                          )}
                        </div>
                        
                        {/* Preview */}
                        <div className="mt-3 p-3 bg-black/20 rounded-lg border border-white/5">
                          <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap break-words">
                            {preview}
                          </pre>
                        </div>

                        {/* Hover indicator */}
                        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 group-hover:text-primary transition">
                          <span>Pilih gaya ini</span>
                          <Check size={14} className="opacity-0 group-hover:opacity-100 transition" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

