import { useState, useCallback, useEffect, useRef } from 'react';
import { convertFullCodeToSections, convertSectionsToFullCode, getDefaultSection, sectionsToLayoutJSON, layoutJSONToSections, getValidatedLayoutJSON } from '@/lib/visual-builder-utils';

/**
 * Custom hook untuk manage visual builder state dan logic
 */
export function useVisualBuilder(initialHtmlTemplate = '') {
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  // Track previous initialHtmlTemplate untuk detect perubahan
  const prevInitialHtmlRef = useRef('');

  // Initialize sections dari HTML template jika ada
  useEffect(() => {
    // Jika initialHtmlTemplate berubah, sync sections
    if (initialHtmlTemplate && initialHtmlTemplate !== prevInitialHtmlRef.current) {
      try {
        const parsedSections = convertFullCodeToSections(initialHtmlTemplate);
        if (parsedSections.length > 0) {
          setSections(parsedSections);
          // Reset editing state saat sync dari external
          setIsEditing(false);
          setEditingSection(null);
          setSelectedSectionId(null);
        } else if (initialHtmlTemplate.trim() === '') {
          // Jika HTML kosong, reset sections
          setSections([]);
          setIsEditing(false);
          setEditingSection(null);
          setSelectedSectionId(null);
        }
        prevInitialHtmlRef.current = initialHtmlTemplate;
      } catch (error) {
        console.error('Error parsing HTML template:', error);
      }
    } else if (!initialHtmlTemplate && prevInitialHtmlRef.current) {
      // Jika HTML dihapus, reset sections
      setSections([]);
      setIsEditing(false);
      setEditingSection(null);
      setSelectedSectionId(null);
      prevInitialHtmlRef.current = '';
    }
  }, [initialHtmlTemplate]);

  // Generate HTML dari sections
  const generateHtml = useCallback((customSections = null) => {
    const sectionsToUse = customSections || sections;
    return convertSectionsToFullCode(sectionsToUse);
  }, [sections]);

  // Add section
  const addSection = useCallback((type) => {
    const newSection = getDefaultSection(type);
    if (newSection) {
      newSection.order = sections.length + 1;
      setSections(prev => [...prev, newSection]);
      return newSection;
    }
    return null;
  }, [sections.length]);

  // Update section
  const updateSection = useCallback((sectionId, updates) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, ...updates }
        : section
    ));
  }, []);

  // Delete section
  const deleteSection = useCallback((sectionId) => {
    setSections(prev => {
      const filtered = prev.filter(s => s.id !== sectionId);
      // Reorder sections
      return filtered.map((section, index) => ({
        ...section,
        order: index + 1
      }));
    });
    
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
      setIsEditing(false);
      setEditingSection(null);
    }
  }, [selectedSectionId]);

  // Reorder sections
  const reorderSections = useCallback((newSections) => {
    setSections(newSections.map((section, index) => ({
      ...section,
      order: index + 1
    })));
  }, []);

  // Toggle section visibility
  const toggleSectionVisibility = useCallback((sectionId) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, visible: section.visible === false ? true : false }
        : section
    ));
  }, []);

  // Edit section
  const startEditing = useCallback((section, index) => {
    setEditingSection(section);
    setSelectedSectionId(section.id);
    setIsEditing(true);
  }, []);

  const saveEditing = useCallback((updatedSection) => {
    updateSection(updatedSection.id, updatedSection);
    setIsEditing(false);
    setEditingSection(null);
    setSelectedSectionId(null);
  }, [updateSection]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditingSection(null);
    setSelectedSectionId(null);
  }, []);

  // Sync dari full code
  const syncFromFullCode = useCallback((htmlTemplate) => {
    if (!htmlTemplate) {
      setSections([]);
      return;
    }

    const parsedSections = convertFullCodeToSections(htmlTemplate);
    if (parsedSections.length > 0) {
      setSections(parsedSections);
    }
  }, []);

  // Get current HTML
  const getCurrentHtml = useCallback(() => {
    return generateHtml();
  }, [generateHtml]);

  // Get Layout JSON (internal representation)
  const getLayoutJSON = useCallback(() => {
    return sectionsToLayoutJSON(sections);
  }, [sections]);

  // Get validated Layout JSON
  const getValidatedJSON = useCallback(() => {
    return getValidatedLayoutJSON(sections);
  }, [sections]);

  // Load from Layout JSON
  const loadFromLayoutJSON = useCallback((layoutJSON) => {
    try {
      const newSections = layoutJSONToSections(layoutJSON);
      if (newSections.length > 0) {
        setSections(newSections);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading from Layout JSON:', error);
      return false;
    }
  }, []);

  return {
    // State
    sections,
    selectedSectionId,
    isEditing,
    editingSection,

    // Actions
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    toggleSectionVisibility,
    startEditing,
    saveEditing,
    cancelEditing,
    syncFromFullCode,
    generateHtml,
    getCurrentHtml,
    setSections,

    // JSON Layer functions
    getLayoutJSON,
    getValidatedJSON,
    loadFromLayoutJSON
  };
}

