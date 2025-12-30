"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Edit2, Trash2, Move } from 'lucide-react';
import { getComponentType } from './ComponentLibrary';

/**
 * Section Component Card
 * Representasi component di dalam section (title, button, dll)
 */
export function SectionComponentCard({
  component,
  index,
  onEdit,
  onDelete,
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
    id: component.id,
    data: {
      type: 'section-component',
      component: component,
      index: index
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const componentType = getComponentType(component.type);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`glass rounded-lg p-3 border transition-all cursor-grab active:cursor-grabbing ${
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-white/5 hover:border-white/10'
      } ${isDragging ? 'shadow-lg scale-105' : ''}`}
    >
      <div className="flex items-center gap-2">
        <div className="text-zinc-400 transition">
          <GripVertical size={14} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{componentType?.icon || '📦'}</span>
            <span className="text-xs font-medium text-white capitalize">
              {componentType?.name || component.type}
            </span>
            <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded font-mono">
              #{component.order || index + 1}
            </span>
          </div>
          <div className="mt-1 text-xs text-zinc-400 truncate">
            {component.config?.text || component.config?.content || component.type}
          </div>
        </div>

        <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit?.(component, index)}
            className="p-1 rounded hover:bg-white/5 transition text-zinc-400 hover:text-primary"
            title="Edit component"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete?.(component.id, index)}
            className="p-1 rounded hover:bg-red-500/20 transition text-zinc-400 hover:text-red-400"
            title="Delete component"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

