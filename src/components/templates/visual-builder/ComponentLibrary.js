// Component Library - Dummy components untuk elemen di dalam section
// Misalnya: Title, Subtitle, Button, Image, dll

export const COMPONENT_TYPES = {
  title: {
    type: 'title',
    name: 'Title',
    icon: '📝',
    defaultConfig: {
      text: '{{name}}',
      size: 'large', // small, medium, large, xlarge
      align: 'center', // left, center, right
      color: 'white'
    }
  },
  subtitle: {
    type: 'subtitle',
    name: 'Subtitle',
    icon: '📄',
    defaultConfig: {
      text: '{{bio}}',
      size: 'medium',
      align: 'center',
      color: 'white/80'
    }
  },
  button: {
    type: 'button',
    name: 'Button',
    icon: '🔘',
    defaultConfig: {
      text: 'Get In Touch',
      style: 'primary', // primary, secondary, outline
      link: '#contact',
      size: 'medium' // small, medium, large
    }
  },
  image: {
    type: 'image',
    name: 'Image',
    icon: '🖼️',
    defaultConfig: {
      src: '{{photo}}',
      alt: '{{name}}',
      size: 'medium', // small, medium, large
      shape: 'circle' // circle, square, rounded
    }
  },
  text: {
    type: 'text',
    name: 'Text',
    icon: '📝',
    defaultConfig: {
      content: 'Your text here',
      size: 'medium',
      align: 'left'
    }
  },
  spacer: {
    type: 'spacer',
    name: 'Spacer',
    icon: '↕️',
    defaultConfig: {
      height: 'medium' // small, medium, large
    }
  }
};

// Helper untuk mendapatkan component type
export function getComponentType(type) {
  return COMPONENT_TYPES[type] || null;
}

// Helper untuk mendapatkan semua available component types
export function getAvailableComponentTypes() {
  return Object.keys(COMPONENT_TYPES);
}

// Mapping section type ke komponen yang tersedia
const SECTION_COMPONENT_MAP = {
  hero: ['title', 'subtitle', 'button', 'image', 'spacer'],
  header: ['title', 'button'],
  about: ['title', 'text', 'image'],
  footer: ['text', 'button'],
  experience: ['title', 'text'],
  projects: ['title', 'text', 'image', 'button'],
  skills: ['title', 'text'],
  contact: ['title', 'text', 'button'],
  education: ['title', 'text'],
  // Default: semua komponen tersedia untuk section type lainnya
};

/**
 * Get available component types untuk section tertentu
 * @param {string} sectionType - Section type (hero, header, about, dll)
 * @returns {Array} - Array of component type strings
 */
export function getComponentsForSection(sectionType) {
  if (!sectionType) {
    // Jika tidak ada section type, return semua komponen
    return getAvailableComponentTypes();
  }
  
  const mappedComponents = SECTION_COMPONENT_MAP[sectionType];
  if (mappedComponents) {
    return mappedComponents;
  }
  
  // Default: semua komponen tersedia
  return getAvailableComponentTypes();
}

// Generate unique ID untuk component
export function generateComponentId() {
  return `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate HTML dari component
export function generateComponentHtml(component) {
  const componentType = getComponentType(component.type);
  if (!componentType) return '';

  const config = component.config || componentType.defaultConfig;

  switch (component.type) {
    case 'title':
      const titleSize = {
        small: 'text-2xl',
        medium: 'text-4xl',
        large: 'text-5xl md:text-7xl',
        xlarge: 'text-6xl md:text-8xl'
      }[config.size || 'large'];
      const titleAlign = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
      }[config.align || 'center'];
      // Handle color class - untuk Tailwind, kita perlu full class name
      const titleColorClass = config.color === 'white' || !config.color 
        ? 'text-white' 
        : config.color === 'white/80' 
          ? 'text-white/80'
          : 'text-white'; // fallback
      return `<h1 class="${titleSize} font-bold ${titleColorClass} mb-4 ${titleAlign}">${config.text || '{{name}}'}</h1>`;

    case 'subtitle':
      const subtitleSize = {
        small: 'text-sm',
        medium: 'text-xl md:text-2xl',
        large: 'text-2xl md:text-3xl'
      }[config.size || 'medium'];
      const subtitleAlign = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
      }[config.align || 'center'];
      const subtitleColorClass = config.color === 'white/80' || !config.color
        ? 'text-white/80'
        : config.color === 'white'
          ? 'text-white'
          : 'text-white/80'; // fallback
      return `<p class="${subtitleSize} ${subtitleColorClass} mb-8 ${subtitleAlign}">${config.text || '{{bio}}'}</p>`;

    case 'button':
      const buttonStyle = {
        primary: 'bg-primary text-white hover:opacity-90',
        secondary: 'bg-white/10 text-white hover:bg-white/20',
        outline: 'bg-transparent text-white border border-white/20 hover:bg-white/10'
      }[config.style || 'primary'];
      const buttonSize = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3',
        large: 'px-8 py-4 text-lg'
      }[config.size || 'medium'];
      return `<a href="${config.link || '#contact'}" class="${buttonSize} ${buttonStyle} rounded-lg transition font-medium">${config.text || 'Button'}</a>`;

    case 'image':
      const imageSize = {
        small: 'w-24 h-24',
        medium: 'w-32 h-32',
        large: 'w-64 h-64'
      }[config.size || 'medium'];
      const imageShape = {
        circle: 'rounded-full',
        square: 'rounded-none',
        rounded: 'rounded-lg'
      }[config.shape || 'circle'];
      return `<img src="${config.src || '{{photo}}'}" alt="${config.alt || '{{name}}'}" class="${imageSize} ${imageShape} border-4 border-white/20" />`;

    case 'text':
      const textSize = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg'
      }[config.size || 'medium'];
      const textAlign = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
      }[config.align || 'left'];
      return `<p class="${textSize} text-white/80 ${textAlign} mb-4">${config.content || 'Your text here'}</p>`;

    case 'spacer':
      const spacerHeight = {
        small: 'h-4',
        medium: 'h-8',
        large: 'h-12'
      }[config.height || 'medium'];
      return `<div class="${spacerHeight}"></div>`;

    default:
      return '';
  }
}

