"use client";

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { getSectionPreset } from './SectionPresets';

/**
 * Section Card Component
 * Representasi section di canvas dengan drag handle
 */
export function SectionCard({ 
  section, 
  index, 
  onEdit, 
  onDelete, 
  onToggleVisibility,
  isSelected = false 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: section.id,
    data: {
      type: 'canvas-section',
      section: section,
      index: index
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const preset = getSectionPreset(section.type);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      {...attributes}
      {...listeners}
      className={`glass rounded-xl p-4 border transition-all relative cursor-grab active:cursor-grabbing ${
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-white/10 hover:border-white/20'
      } ${isDragging ? 'shadow-lg scale-105' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="text-zinc-400 transition">
          <GripVertical size={18} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-white truncate">
              {section.name}
            </h3>
            {section.isOptional && (
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                Optional
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-400 capitalize">{section.type}</span>
            {section.layout && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-zinc-400 capitalize">
                  {section.layout.replace('-', ' ')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleVisibility?.(section.id)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition text-zinc-400 hover:text-white"
            title={section.visible !== false ? 'Hide section' : 'Show section'}
          >
            {section.visible !== false ? (
              <Eye size={14} />
            ) : (
              <EyeOff size={14} />
            )}
          </button>
          <button
            onClick={() => onEdit?.(section, index)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition text-zinc-400 hover:text-primary"
            title="Edit section"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete?.(section.id, index)}
            className="p-1.5 rounded-lg hover:bg-red-500/20 transition text-zinc-400 hover:text-red-400"
            title="Delete section"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>


      {/* Order Badge */}
      <div className="absolute top-2 right-2">
        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded font-mono">
          #{section.order || index + 1}
        </span>
      </div>
    </motion.div>
  );
}

