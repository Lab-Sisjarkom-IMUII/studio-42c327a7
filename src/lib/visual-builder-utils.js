// Visual Builder Utilities
// Functions untuk convert antara full code dan visual mode

import { parseTemplate } from './template-parser';
import { getSectionPreset, getSectionTemplate } from '@/components/templates/visual-builder/SectionPresets';
import { generateComponentHtml, generateComponentId } from '@/components/templates/visual-builder/ComponentLibrary';
import { convertSectionsToLayoutJSON, convertLayoutJSONToSections, validateLayoutJSON } from './layout-json-utils';

/**
 * Convert HTML template (full code) ke sections array (visual mode)
 * @param {string} htmlTemplate - Full HTML template
 * @returns {Array} - Array of sections untuk visual builder
 */
export function convertFullCodeToSections(htmlTemplate) {
  if (!htmlTemplate || !htmlTemplate.trim()) {
    return [];
  }

  try {
    const parsed = parseTemplate(htmlTemplate);
    
    if (!parsed.sections || parsed.sections.length === 0) {
      return [];
    }

    // Convert parsed sections ke format visual builder
    return parsed.sections.map((section, index) => {
      // Coba detect layout dari HTML content
      const detectedLayout = detectLayoutFromHtml(section.type, section.htmlContent);
      
      // Generate unique ID untuk section
      const id = `section-${Date.now()}-${index}`;

      return {
        id,
        type: section.type,
        name: section.name || `${section.type} Section`,
        layout: detectedLayout || 'default',
        order: section.order || index + 1,
        isOptional: section.isOptional || false,
        condition: section.condition || null,
        htmlContent: section.htmlContent || '',
        config: extractConfigFromHtml(section.type, section.htmlContent)
      };
    });
  } catch (error) {
    console.error('Error converting full code to sections:', error);
    return [];
  }
}

/**
 * Convert sections array (visual mode) ke HTML template (full code)
 * @param {Array} sections - Array of sections dari visual builder
 * @param {string} headContent - Head content (optional)
 * @param {string} bodyAttributes - Body attributes (optional)
 * @returns {string} - Full HTML template
 */
export function convertSectionsToFullCode(sections, headContent = '', bodyAttributes = '') {
  if (!sections || sections.length === 0) {
    return '';
  }

  // Filter out duplicate sections by ID (jika ada)
  const uniqueSections = sections.filter((section, index, self) => 
    index === self.findIndex(s => s.id === section.id)
  );

  // Sort sections by order
  const sortedSections = [...uniqueSections].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Generate HTML untuk setiap section
  const sectionsHtml = sortedSections.map(section => {
    // Generate HTML dari section config dan layout
    let html = generateHtmlFromSection(section);
    
    // Remove existing comment markers dari template (jika ada)
    // Template preset mungkin sudah include comment, jadi kita hapus dulu
    // Pattern: <!-- [TYPE] [OPTIONAL] Name --> dengan whitespace
    html = html.replace(/<!--\s*\[[A-Z_]+\]\s*(?:\[OPTIONAL\])?\s*.*?-->\s*/gi, '');
    html = html.trim(); // Remove leading/trailing whitespace setelah hapus comment
    
    // Build comment marker
    let comment = `<!-- [${section.type.toUpperCase()}]`;
    if (section.isOptional) {
      comment += ' [OPTIONAL]';
    }
    comment += ` ${section.name} -->`;
    
    return `${comment}\n${html}`;
  }).join('\n\n');

  // Build full HTML template
  const defaultHead = headContent || `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Template</title>
  <script src="https://cdn.tailwindcss.com"></script>`;

  const bodyAttrs = bodyAttributes ? ` ${bodyAttributes.trim()}` : '';
  
  return `<!DOCTYPE html>
<html lang="id">
<head>${defaultHead}
</head>
<body${bodyAttrs}>
${sectionsHtml}
</body>
</html>`;
}

/**
 * Generate HTML dari section object
 * @param {Object} section - Section object dengan config
 * @returns {string} - HTML content untuk section
 */
function generateHtmlFromSection(section) {
  // Jika section punya components, generate dari components
  if (section.components && section.components.length > 0) {
    const componentsHtml = section.components
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(component => generateComponentHtml(component))
      .join('\n    ');

    // Wrap dalam section tag
    return `<section class="py-20">
  <div class="container mx-auto px-6">
    ${componentsHtml}
  </div>
</section>`;
  }

  // Fallback ke template preset
  const preset = getSectionPreset(section.type);
  
  if (!preset) {
    return section.htmlContent || '';
  }

  let template = getSectionTemplate(section.type, section.layout || preset.defaultLayout);
  
  if (!template) {
    return section.htmlContent || '';
  }

  // Apply config ke template
  template = applySectionConfig(template, section, preset);

  return template;
}

/**
 * Apply section config ke HTML template
 * @param {string} template - HTML template string
 * @param {Object} section - Section object dengan config
 * @param {Object} preset - Section preset
 * @returns {string} - HTML dengan config applied
 */
function applySectionConfig(template, section, preset) {
  if (!section.config || !preset.configurable) {
    return template;
  }

  let html = template;
  const config = section.config;

  // Apply backgroundColor untuk header/section/footer
  if (config.backgroundColor && preset.configurable.backgroundColor) {
    const colorOption = preset.configurable.backgroundColor.options?.find(
      opt => opt.value === config.backgroundColor
    );
    if (colorOption) {
      // Helper function untuk replace bg classes di tag
      const replaceBgInTag = (tagName) => {
        // Pattern untuk match tag dengan class attribute
        const tagPattern = new RegExp(`(<${tagName}[^>]*class=")([^"]*)(")`, 'i');
        
        html = html.replace(tagPattern, (match, before, classContent, after) => {
          // Split classes dan filter out semua bg-* classes (termasuk gradient)
          const classes = classContent.split(/\s+/).filter(cls => {
            // Filter out: bg-*, bg-gradient-*, from-*, to-*
            return cls && !cls.match(/^(bg-|from-|to-)/);
          });
          
          // Tambahkan colorOption.class di awal
          // Jika colorOption.class adalah multiple classes (gradient), split dulu
          const newBgClasses = colorOption.class.split(/\s+/);
          classes.unshift(...newBgClasses);
          
          return `${before}${classes.join(' ')}${after}`;
        });
      };
      
      // Apply untuk header, section, dan footer
      replaceBgInTag('header');
      replaceBgInTag('section');
      replaceBgInTag('footer');
    }
  }

  // Apply navItems untuk header
  if (config.navItems && Array.isArray(config.navItems) && section.type === 'header') {
    // Generate nav items HTML
    const navItemsHtml = config.navItems
      .map(item => {
        const label = item.label || item;
        const href = item.href || `#${label.toLowerCase().replace(/\s+/g, '-')}`;
        // Check jika item terakhir dan layout sticky, tambahkan button style
        const isLast = config.navItems.indexOf(item) === config.navItems.length - 1;
        const isSticky = section.layout === 'sticky';
        if (isLast && isSticky && label.toLowerCase() === 'contact') {
          return `<a href="${href}" class="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition">${label}</a>`;
        }
        return `<a href="${href}" class="text-white/80 hover:text-white transition">${label}</a>`;
      })
      .join('\n        ');

    // Replace nav items di template
    // Pattern 1: hidden md:flex (desktop nav)
    html = html.replace(
      /(<div class="[^"]*hidden md:flex gap-6[^"]*">)[\s\S]*?(<\/div>)/,
      `$1\n        ${navItemsHtml}\n      $2`
    );
    // Pattern 2: flex gap-6 (mobile nav atau left-aligned)
    html = html.replace(
      /(<div class="[^"]*flex gap-6[^"]*">)(?![\s\S]*hidden md:flex)[\s\S]*?(<\/div>)/,
      `$1\n        ${navItemsHtml}\n      $2`
    );
  }

  return html;
}

/**
 * Detect layout dari HTML content
 * @param {string} type - Section type
 * @param {string} htmlContent - HTML content
 * @returns {string} - Detected layout name
 */
function detectLayoutFromHtml(type, htmlContent) {
  if (!htmlContent) return 'default';

  const preset = getSectionPreset(type);
  if (!preset) return 'default';

  // Simple detection berdasarkan class atau structure
  // Bisa ditingkatkan dengan pattern matching yang lebih sophisticated
  const lowerHtml = htmlContent.toLowerCase();
  
  // Check untuk setiap layout option
  for (const layout of preset.layouts) {
    const layoutKeywords = {
      'centered': ['center', 'text-center', 'justify-center'],
      'left-aligned': ['left', 'justify-start'],
      'sticky': ['sticky', 'top-0'],
      'full-width': ['full', 'w-full'],
      'split': ['grid', 'grid-cols-2', 'split'],
      'simple': ['simple', 'basic'],
      'card': ['card', 'rounded', 'bg-white'],
      'timeline': ['timeline', 'border-l'],
      'list': ['list', 'space-y'],
      'grid': ['grid', 'grid-cols'],
      'tags': ['flex', 'flex-wrap', 'gap'],
      'progress': ['progress', 'w-full'],
      'masonry': ['columns', 'masonry'],
      'links': ['links', 'ul', 'li'],
      'social': ['social', 'flex', 'gap']
    };

    const keywords = layoutKeywords[layout] || [];
    if (keywords.some(keyword => lowerHtml.includes(keyword))) {
      return layout;
    }
  }

  return preset.defaultLayout;
}

/**
 * Extract config dari HTML content
 * @param {string} type - Section type
 * @param {string} htmlContent - HTML content
 * @returns {Object} - Extracted config
 */
function extractConfigFromHtml(type, htmlContent) {
  const preset = getSectionPreset(type);
  if (!preset || !preset.configurable) {
    return {};
  }

  const config = {};
  
  // Extract basic text fields
  // Ini adalah implementasi sederhana, bisa ditingkatkan
  for (const [key, fieldConfig] of Object.entries(preset.configurable)) {
    if (fieldConfig.type === 'text') {
      // Coba extract dari placeholder atau content
      const placeholder = `{{${key}}}`;
      if (htmlContent.includes(placeholder)) {
        config[key] = fieldConfig.default || '';
      }
    } else if (fieldConfig.type === 'boolean') {
      // Extract boolean dari class atau attribute
      config[key] = fieldConfig.default || false;
    }
  }

  return config;
}

/**
 * Validate section object
 * @param {Object} section - Section object
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export function validateSection(section) {
  const errors = [];

  if (!section.type) {
    errors.push('Section type is required');
  }

  if (!section.name || section.name.trim() === '') {
    errors.push('Section name is required');
  }

  if (section.order === undefined || section.order === null) {
    errors.push('Section order is required');
  }

  // Validate config sesuai dengan preset
  const preset = getSectionPreset(section.type);
  if (preset && preset.configurable) {
    for (const [key, fieldConfig] of Object.entries(preset.configurable)) {
      if (fieldConfig.required && (!section.config || !section.config[key])) {
        errors.push(`${key} is required`);
      }

      if (section.config && section.config[key]) {
        if (fieldConfig.type === 'text' && fieldConfig.maxLength) {
          if (section.config[key].length > fieldConfig.maxLength) {
            errors.push(`${key} exceeds maximum length of ${fieldConfig.maxLength}`);
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate unique ID untuk section
 * @returns {string} - Unique ID
 */
export function generateSectionId() {
  return `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get default section berdasarkan type dan layout
 * @param {string} type - Section type
 * @param {string} layout - Layout name (optional, defaults to preset.defaultLayout)
 * @returns {Object} - Default section object
 */
export function getDefaultSection(type, layout = null) {
  const preset = getSectionPreset(type);
  if (!preset) {
    return null;
  }

  const id = generateSectionId();
  const selectedLayout = layout || preset.defaultLayout;
  
  return {
    id,
    type: preset.type,
    name: preset.name,
    layout: selectedLayout,
    order: 0,
    isOptional: type !== 'header' && type !== 'footer',
    condition: type !== 'header' && type !== 'footer' && type !== 'hero' && type !== 'about' 
      ? `if:${type}` 
      : null,
    htmlContent: getSectionTemplate(type, selectedLayout),
    config: {}
    // Tidak lagi generate components - section sudah punya preset layout
  };
}

/**
 * Generate default components untuk section type
 * @param {string} sectionType - Section type
 * @returns {Array} - Array of default components
 */
function generateDefaultComponents(sectionType) {
  const components = [];
  
  switch (sectionType) {
    case 'hero':
      components.push(
        { id: generateComponentId(), type: 'title', order: 1, config: { text: '{{name}}', size: 'large', align: 'center' } },
        { id: generateComponentId(), type: 'subtitle', order: 2, config: { text: '{{bio}}', size: 'medium', align: 'center' } },
        { id: generateComponentId(), type: 'button', order: 3, config: { text: 'Get In Touch', style: 'primary', link: '#contact' } }
      );
      break;
    case 'header':
      components.push(
        { id: generateComponentId(), type: 'title', order: 1, config: { text: '{{name}}', size: 'medium', align: 'left' } }
      );
      break;
    case 'about':
      components.push(
        { id: generateComponentId(), type: 'title', order: 1, config: { text: 'About Me', size: 'large', align: 'center' } },
        { id: generateComponentId(), type: 'text', order: 2, config: { content: '{{bio}}', size: 'medium', align: 'left' } }
      );
      break;
    default:
      // Default: minimal components
      components.push(
        { id: generateComponentId(), type: 'title', order: 1, config: { text: 'Section Title', size: 'large', align: 'center' } }
      );
  }
  
  return components;
}

// Note: generateComponentId sekarang ada di ComponentLibrary.js
// Import dari sana jika diperlukan

/**
 * Convert sections array ke Layout JSON (internal representation)
 * @param {Array} sections - Array of sections
 * @returns {Object} - Layout JSON object
 */
export function sectionsToLayoutJSON(sections) {
  return convertSectionsToLayoutJSON(sections);
}

/**
 * Convert Layout JSON kembali ke sections array
 * @param {Object} layoutJSON - Layout JSON object
 * @returns {Array} - Array of sections
 */
export function layoutJSONToSections(layoutJSON) {
  return convertLayoutJSONToSections(layoutJSON);
}

/**
 * Validate Layout JSON
 * @param {Object} layoutJSON - Layout JSON object
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export function validateLayoutJSONStructure(layoutJSON) {
  return validateLayoutJSON(layoutJSON);
}

/**
 * Get Layout JSON dari sections dan validate
 * @param {Array} sections - Array of sections
 * @returns {Object} - { json: Object, valid: boolean, errors: Array }
 */
export function getValidatedLayoutJSON(sections) {
  const json = convertSectionsToLayoutJSON(sections);
  const validation = validateLayoutJSON(json);
  
  return {
    json,
    ...validation
  };
}

