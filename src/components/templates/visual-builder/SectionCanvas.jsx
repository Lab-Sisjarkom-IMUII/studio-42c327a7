"use client";

import { useState, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { FileText, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { exportLayoutJSON, importLayoutJSON } from '@/lib/layout-json-export';
import { sectionsToLayoutJSON, layoutJSONToSections } from '@/lib/visual-builder-utils';

/**
 * Droppable Canvas Area
 */
function DroppableCanvas({ children, isEmpty } {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
    data: {
      type: 'canvas'
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 overflow-y-auto p-6 transition-all ${
        isOver ? 'bg-primary/5 border-2 border-primary border-dashed' : ''
      }`}
    >
      {isEmpty ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <FileText size={48} className="text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-sm mb-2">No sections yet</p>
            <p className="text-zinc-500 text-xs">
              Drag sections from the library to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">{children}</div>
      )}
    </div>
  );
}

/**
 * Section Canvas Component
 * Canvas area dengan drag-and-drop support untuk sections
 */
export function SectionCanvas({
  sections = [],
  onSectionsChange,
  onEditSection,
  onDeleteSection,
  onToggleSectionVisibility,
  selectedSectionId = null
}) {
  const [exportStatus, setExportStatus] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  // Handle export JSON
  const handleExportJSON = () => {
    try {
      const layoutJSON = sectionsToLayoutJSON(sections);
      const result = exportLayoutJSON(layoutJSON, `template-layout-${Date.now()}.json`);
      
      if (result.success) {
        setExportStatus({ type: 'success', message: 'Layout JSON exported successfully' });
        setTimeout(() => setExportStatus(null), 3000);
      } else {
        setExportStatus({ type: 'error', message: result.error || 'Export failed' });
        setTimeout(() => setExportStatus(null), 3000);
      }
    } catch (error) {
      setExportStatus({ type: 'error', message: error.message || 'Export failed' });
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  // Handle import JSON
  const handleImportJSON = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await importLayoutJSON(file);
      
      if (result.success) {
        const newSections = layoutJSONToSections(result.layoutJSON);
        if (newSections.length > 0) {
          onSectionsChange(newSections);
          setImportStatus({ type: 'success', message: 'Layout JSON imported successfully' });
        } else {
          setImportStatus({ type: 'error', message: 'No sections found in JSON' });
        }
      } else {
        setImportStatus({ type: 'error', message: result.errors?.join(', ') || 'Import failed' });
      }
      
      setTimeout(() => setImportStatus(null), 3000);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setImportStatus({ type: 'error', message: error.message || 'Import failed' });
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[--background]">
      {/* Header */}
      <div className="glass border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-sm text-white">Visual Canvas</h2>
          <p className="text-xs text-zinc-400 mt-1">
            {sections.length} section{sections.length !== 1 ? 's' : ''} added
          </p>
        </div>
        
        {/* Export/Import Actions */}
        <div className="flex items-center gap-2">
          {/* Status Messages */}
          {exportStatus && (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
              exportStatus.type === 'success' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {exportStatus.type === 'success' ? (
                <CheckCircle size={12} />
              ) : (
                <AlertCircle size={12} />
              )}
              <span>{exportStatus.message}</span>
            </div>
          )}
          
          {importStatus && (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
              importStatus.type === 'success' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {importStatus.type === 'success' ? (
                <CheckCircle size={12} />
              ) : (
                <AlertCircle size={12} />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={handleExportJSON}
            disabled={sections.length === 0}
            className="px-3 py-1.5 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30 transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export Layout JSON"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>

          {/* Import Button */}
          <label className="px-3 py-1.5 text-xs bg-white/10 text-white rounded hover:bg-white/20 transition flex items-center gap-1.5 cursor-pointer">
            <Upload size={14} />
            <span>Import JSON</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Canvas Area */}
      <DroppableCanvas isEmpty={sections.length === 0}>
        {sections.length > 0 && (
          <SortableContext
            items={sections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
              {sections.map((section, index) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  index={index}
                  onEdit={onEditSection}
                  onDelete={onDeleteSection}
                  onToggleVisibility={onToggleSectionVisibility}
                  isSelected={selectedSectionId === section.id}
                />
              ))}
          </SortableContext>
        )}
      </DroppableCanvas>
    </div>
  );
}

