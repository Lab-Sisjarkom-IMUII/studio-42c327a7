// Layout JSON Export/Import Utilities
// Functions untuk export dan import Layout JSON ke/dari file

import { validateLayoutJSON } from './layout-json-utils';

/**
 * Export Layout JSON ke file
 * @param {Object} layoutJSON - Layout JSON object
 * @param {string} filename - Filename untuk export (optional)
 */
export function exportLayoutJSON(layoutJSON, filename = 'layout.json') {
  try {
    // Validate sebelum export
    const validation = validateLayoutJSON(layoutJSON);
    if (!validation.valid) {
      console.warn('Layout JSON has validation errors:', validation.errors);
      // Tetap export tapi dengan warning
    }

    // Convert ke JSON string dengan formatting
    const jsonString = JSON.stringify(layoutJSON, null, 2);
    
    // Create blob dan download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, errors: validation.errors };
  } catch (error) {
    console.error('Error exporting Layout JSON:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Import Layout JSON dari file
 * @param {File} file - File object
 * @returns {Promise<Object>} - { success: boolean, layoutJSON: Object, errors: Array }
 */
export async function importLayoutJSON(file) {
  try {
    // Read file
    const text = await file.text();
    
    // Parse JSON
    const layoutJSON = JSON.parse(text);
    
    // Validate
    const validation = validateLayoutJSON(layoutJSON);
    
    if (!validation.valid) {
      return {
        success: false,
        layoutJSON: null,
        errors: validation.errors
      };
    }

    return {
      success: true,
      layoutJSON,
      errors: []
    };
  } catch (error) {
    console.error('Error importing Layout JSON:', error);
    return {
      success: false,
      layoutJSON: null,
      errors: [error.message || 'Failed to parse JSON file']
    };
  }
}

/**
 * Import Layout JSON dari string
 * @param {string} jsonString - JSON string
 * @returns {Object} - { success: boolean, layoutJSON: Object, errors: Array }
 */
export function importLayoutJSONFromString(jsonString) {
  try {
    // Parse JSON
    const layoutJSON = JSON.parse(jsonString);
    
    // Validate
    const validation = validateLayoutJSON(layoutJSON);
    
    if (!validation.valid) {
      return {
        success: false,
        layoutJSON: null,
        errors: validation.errors
      };
    }

    return {
      success: true,
      layoutJSON,
      errors: []
    };
  } catch (error) {
    console.error('Error importing Layout JSON from string:', error);
    return {
      success: false,
      layoutJSON: null,
      errors: [error.message || 'Failed to parse JSON string']
    };
  }
}

/**
 * Copy Layout JSON ke clipboard
 * @param {Object} layoutJSON - Layout JSON object
 * @returns {Promise<Object>} - { success: boolean, error: string }
 */
export async function copyLayoutJSONToClipboard(layoutJSON) {
  try {
    const jsonString = JSON.stringify(layoutJSON, null, 2);
    await navigator.clipboard.writeText(jsonString);
    return { success: true };
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return { success: false, error: error.message };
  }
}

