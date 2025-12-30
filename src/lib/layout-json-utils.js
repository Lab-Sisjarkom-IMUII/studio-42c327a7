// Layout JSON Utilities
// Functions untuk convert antara sections array dan layout JSON format
// JSON format mengikuti schema-driven approach dari action plan

/**
 * Convert sections array ke Layout JSON format
 * @param {Array} sections - Array of sections dari visual builder
 * @returns {Object} - Layout JSON object
 */
export function convertSectionsToLayoutJSON(sections) {
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));

  return {
    version: "1.0",
    metadata: {
      generatedAt: new Date().toISOString(),
      totalSections: sortedSections.length
    },
    layout: {
      components: sortedSections.map(section => {
        // Convert section ke component format
        const component = {
          id: section.id,
          component: section.type,
          props: {
            name: section.name,
            layout: section.layout || 'default',
            isOptional: section.isOptional || false,
            condition: section.condition || null,
            visible: section.visible !== false,
            ...(section.config || {})
          },
          slots: {}
        };

        // Convert section components ke slots
        if (section.components && section.components.length > 0) {
          const sortedComponents = [...section.components]
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          component.slots.content = sortedComponents.map(comp => ({
            id: comp.id,
            component: comp.type,
            props: comp.config || {},
            order: comp.order || 0
          }));
        }

        return component;
      })
    }
  };
}

/**
 * Convert Layout JSON kembali ke sections array
 * @param {Object} layoutJSON - Layout JSON object
 * @returns {Array} - Array of sections untuk visual builder
 */
export function convertLayoutJSONToSections(layoutJSON) {
  if (!layoutJSON || !layoutJSON.layout || !layoutJSON.layout.components) {
    return [];
  }

  return layoutJSON.layout.components.map((comp, index) => {
    const section = {
      id: comp.id || `section-${Date.now()}-${index}`,
      type: comp.component,
      name: comp.props?.name || `${comp.component} Section`,
      layout: comp.props?.layout || 'default',
      order: index + 1,
      isOptional: comp.props?.isOptional || false,
      condition: comp.props?.condition || null,
      visible: comp.props?.visible !== false,
      config: {},
      components: []
    };

    // Extract config dari props (exclude metadata props)
    const metadataProps = ['name', 'layout', 'isOptional', 'condition', 'visible'];
    for (const [key, value] of Object.entries(comp.props || {})) {
      if (!metadataProps.includes(key)) {
        section.config[key] = value;
      }
    }

    // Convert slots content kembali ke components
    if (comp.slots?.content && Array.isArray(comp.slots.content)) {
      section.components = comp.slots.content.map(slotComp => ({
        id: slotComp.id || `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: slotComp.component,
        order: slotComp.order || 0,
        config: slotComp.props || {}
      }));
    }

    return section;
  });
}

/**
 * Validate Layout JSON structure
 * @param {Object} layoutJSON - Layout JSON object to validate
 * @returns {Object} - { valid: boolean, errors: Array<string> }
 */
export function validateLayoutJSON(layoutJSON) {
  const errors = [];

  // Check basic structure
  if (!layoutJSON) {
    errors.push('Layout JSON is required');
    return { valid: false, errors };
  }

  if (!layoutJSON.version) {
    errors.push('Layout JSON version is required');
  }

  if (!layoutJSON.layout) {
    errors.push('Layout JSON layout object is required');
    return { valid: false, errors };
  }

  if (!Array.isArray(layoutJSON.layout.components)) {
    errors.push('Layout JSON layout.components must be an array');
    return { valid: false, errors };
  }

  // Validate each component
  layoutJSON.layout.components.forEach((comp, index) => {
    if (!comp.component) {
      errors.push(`Component at index ${index} is missing 'component' field`);
    }

    if (!comp.id) {
      errors.push(`Component at index ${index} is missing 'id' field`);
    }

    if (comp.slots && typeof comp.slots !== 'object') {
      errors.push(`Component at index ${index} has invalid 'slots' field (must be object)`);
    }

    // Validate slots content if exists
    if (comp.slots?.content) {
      if (!Array.isArray(comp.slots.content)) {
        errors.push(`Component at index ${index} has invalid 'slots.content' (must be array)`);
      } else {
        comp.slots.content.forEach((slotComp, slotIndex) => {
          if (!slotComp.component) {
            errors.push(`Component at index ${index}, slot content at index ${slotIndex} is missing 'component' field`);
          }
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get Layout JSON schema version
 * @param {Object} layoutJSON - Layout JSON object
 * @returns {string} - Version string
 */
export function getLayoutJSONVersion(layoutJSON) {
  return layoutJSON?.version || 'unknown';
}

/**
 * Merge two Layout JSON objects
 * Useful untuk update partial layout
 * @param {Object} baseJSON - Base layout JSON
 * @param {Object} updateJSON - Update layout JSON (partial)
 * @returns {Object} - Merged layout JSON
 */
export function mergeLayoutJSON(baseJSON, updateJSON) {
  if (!baseJSON || !baseJSON.layout) {
    return updateJSON || baseJSON;
  }

  if (!updateJSON || !updateJSON.layout) {
    return baseJSON;
  }

  // Merge components by ID
  const baseComponents = baseJSON.layout.components || [];
  const updateComponents = updateJSON.layout.components || [];

  const mergedComponents = [...baseComponents];

  updateComponents.forEach(updateComp => {
    const existingIndex = mergedComponents.findIndex(c => c.id === updateComp.id);
    if (existingIndex >= 0) {
      // Update existing component
      mergedComponents[existingIndex] = {
        ...mergedComponents[existingIndex],
        ...updateComp,
        props: {
          ...mergedComponents[existingIndex].props,
          ...updateComp.props
        },
        slots: {
          ...mergedComponents[existingIndex].slots,
          ...updateComp.slots
        }
      };
    } else {
      // Add new component
      mergedComponents.push(updateComp);
    }
  });

  return {
    ...baseJSON,
    layout: {
      ...baseJSON.layout,
      components: mergedComponents
    },
    metadata: {
      ...baseJSON.metadata,
      ...updateJSON.metadata,
      lastUpdated: new Date().toISOString()
    }
  };
}

