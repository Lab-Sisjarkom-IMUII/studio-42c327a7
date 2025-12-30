"use client";

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { getDefaultSection, sectionsToLayoutJSON } from '@/lib/visual-builder-utils';
import { SectionLibrary } from './SectionLibrary';
import { SectionCanvas } from './SectionCanvas';
import { SectionEditor } from './SectionEditor';
import { LayoutSelector } from './LayoutSelector';
import { useVisualBuilder } from '@/hooks/useVisualBuilder';

/**
 * Visual Builder Main Component
 * Combine SectionLibrary, SectionCanvas, dan SectionEditor
 */
export function VisualBuilder({ 
  initialHtmlTemplate = '',
  onHtmlChange,
  onSectionsChange,
  onLayoutJSONChange // Optional callback untuk Layout JSON changes
}) {
  const {
    sections,
    selectedSectionId,
    isEditing,
    editingSection,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    toggleSectionVisibility,
    startEditing,
    saveEditing,
    cancelEditing,
    generateHtml,
    getLayoutJSON,
    getValidatedJSON
  } = useVisualBuilder(initialHtmlTemplate);

  // Track selected section type untuk filtering komponen
  const selectedSectionType = editingSection?.type || null;

  // Track active drag untuk DragOverlay
  const [activeId, setActiveId] = useState(null);
  const [activeData, setActiveData] = useState(null);

  // Layout selector state
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [selectedSectionTypeForLayout, setSelectedSectionTypeForLayout] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Sync HTML changes ke parent
  const handleSectionsChange = (newSections) => {
    reorderSections(newSections);
    const html = generateHtml(newSections);
    onHtmlChange?.(html);
    onSectionsChange?.(newSections);
    
    // Also sync Layout JSON (internal representation)
    const layoutJSON = sectionsToLayoutJSON(newSections);
    onLayoutJSONChange?.(layoutJSON);
  };

  // Handle section edit
  const handleEditSection = (section, index) => {
    startEditing(section, index);
  };

  // Handle section save
  const handleSaveSection = (updatedSection) => {
    saveEditing(updatedSection);
    const html = generateHtml();
    onHtmlChange?.(html);
    
    // Also sync Layout JSON
    const layoutJSON = getLayoutJSON();
    onLayoutJSONChange?.(layoutJSON);
  };

  // Handle section delete
  const handleDeleteSection = (sectionId) => {
    deleteSection(sectionId);
    const html = generateHtml();
    onHtmlChange?.(html);
    
    // Also sync Layout JSON
    const layoutJSON = getLayoutJSON();
    onLayoutJSONChange?.(layoutJSON);
  };

  // Handle toggle visibility
  const handleToggleVisibility = (sectionId) => {
    toggleSectionVisibility(sectionId);
    const html = generateHtml();
    onHtmlChange?.(html);
    
    // Also sync Layout JSON
    const layoutJSON = getLayoutJSON();
    onLayoutJSONChange?.(layoutJSON);
  };

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveData(active.data.current);
  };

  // Handle section click dari library
  const handleSectionClick = (sectionType) => {
    setSelectedSectionTypeForLayout(sectionType);
    setShowLayoutSelector(true);
  };

  // Handle layout selection
  const handleLayoutSelect = (layout) => {
    const newSection = getDefaultSection(selectedSectionTypeForLayout, layout);
    
    if (newSection) {
      newSection.order = sections.length + 1;
      const newSections = [...sections, newSection];
      handleSectionsChange(newSections);
      // Auto-open editor untuk section baru
      startEditing(newSection, newSections.length - 1);
    }
    
    setShowLayoutSelector(false);
    setSelectedSectionTypeForLayout(null);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    // Reset active drag
    setActiveId(null);
    setActiveData(null);
    
    if (!over) return;

    // Handle reorder sections within canvas
    if (active.data.current?.type === 'canvas-section' && active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = arrayMove(sections, oldIndex, newIndex);
        const updatedSections = newSections.map((section, index) => ({
          ...section,
          order: index + 1
        }));
        handleSectionsChange(updatedSections);
      }
    }
  };

  // Render drag overlay content
  const renderDragOverlay = () => {
    if (!activeId || !activeData) return null;

    if (activeData.type === 'library-section') {
      return (
        <div className="glass rounded-xl p-4 border border-primary bg-primary/10">
          <p className="text-sm text-white font-medium">
            {activeData.preset?.name || 'Section'}
          </p>
        </div>
      );
    }

    if (activeData.type === 'library-component') {
      return (
        <div className="glass rounded-lg p-3 border border-primary bg-primary/10">
          <p className="text-xs text-white font-medium">
            {activeData.componentDef?.name || 'Component'}
          </p>
        </div>
      );
    }

    if (activeData.type === 'canvas-section') {
      return (
        <div className="glass rounded-xl p-4 border border-primary bg-primary/10">
          <p className="text-sm text-white font-medium">
            {activeData.section?.name || 'Section'}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex overflow-hidden">
        {/* Section Library - Left Sidebar */}
        <div className="w-80 shrink-0">
          <SectionLibrary 
            onSectionClick={handleSectionClick}
          />
        </div>

        {/* Section Canvas - Center */}
        <div className="flex-1 flex flex-col">
          <SectionCanvas
            sections={sections}
            onSectionsChange={handleSectionsChange}
            onEditSection={handleEditSection}
            onDeleteSection={handleDeleteSection}
            onToggleSectionVisibility={handleToggleVisibility}
            selectedSectionId={selectedSectionId}
          />
        </div>

        {/* Section Editor - Right Sidebar */}
        {isEditing && editingSection && (
          <SectionEditor
            section={editingSection}
            onSave={handleSaveSection}
            onClose={cancelEditing}
            onDelete={handleDeleteSection}
          />
        )}
      </div>

      <DragOverlay>
        {renderDragOverlay()}
      </DragOverlay>

      {/* Layout Selector Modal */}
      <LayoutSelector
        sectionType={selectedSectionTypeForLayout}
        isOpen={showLayoutSelector}
        onClose={() => {
          setShowLayoutSelector(false);
          setSelectedSectionTypeForLayout(null);
        }}
        onSelectLayout={handleLayoutSelect}
      />
    </DndContext>
  );
}

