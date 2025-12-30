// Section Presets - Dummy components untuk setiap section type
// Berisi HTML templates dengan berbagai layout options

export const SECTION_PRESETS = {
  header: {
    type: 'header',
    name: 'Header Navigation',
    layouts: ['centered', 'left-aligned', 'sticky'],
    defaultLayout: 'centered',
    htmlTemplates: {
      'centered': `<header class="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
  <nav class="container mx-auto px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="text-xl font-bold text-white">{{name}}</div>
      <div class="hidden md:flex gap-6">
        <a href="#about" class="text-white/80 hover:text-white transition">About</a>
        <a href="#experience" class="text-white/80 hover:text-white transition">Experience</a>
        <a href="#projects" class="text-white/80 hover:text-white transition">Projects</a>
        <a href="#contact" class="text-white/80 hover:text-white transition">Contact</a>
      </div>
    </div>
  </nav>
</header>`,
      'left-aligned': `<header class="bg-white/10 backdrop-blur-md border-b border-white/20">
  <nav class="container mx-auto px-6 py-4">
    <div class="flex items-center gap-8">
      <div class="text-xl font-bold text-white">{{name}}</div>
      <div class="flex gap-6">
        <a href="#about" class="text-white/80 hover:text-white transition">About</a>
        <a href="#experience" class="text-white/80 hover:text-white transition">Experience</a>
        <a href="#projects" class="text-white/80 hover:text-white transition">Projects</a>
        <a href="#contact" class="text-white/80 hover:text-white transition">Contact</a>
      </div>
    </div>
  </nav>
</header>`,
      'sticky': `<header class="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg">
  <nav class="container mx-auto px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="text-xl font-bold text-white">{{name}}</div>
      <div class="hidden md:flex gap-6">
        <a href="#about" class="text-white/80 hover:text-white transition">About</a>
        <a href="#experience" class="text-white/80 hover:text-white transition">Experience</a>
        <a href="#projects" class="text-white/80 hover:text-white transition">Projects</a>
        <a href="#contact" class="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition">Contact</a>
      </div>
    </div>
  </nav>
</header>`
    },
    configurable: {
      backgroundColor: { 
        type: 'color', 
        default: 'white/10',
        options: [
          { value: 'white/10', label: 'White 10%', class: 'bg-white/10' },
          { value: 'white/20', label: 'White 20%', class: 'bg-white/20' },
          { value: 'black/50', label: 'Black 50%', class: 'bg-black/50' },
          { value: 'primary/20', label: 'Primary 20%', class: 'bg-primary/20' },
          { value: 'transparent', label: 'Transparent', class: 'bg-transparent' }
        ]
      },
      navItems: { 
        type: 'array', 
        default: [
          { label: 'About', href: '#about' },
          { label: 'Experience', href: '#experience' },
          { label: 'Projects', href: '#projects' },
          { label: 'Contact', href: '#contact' }
        ],
        itemSchema: {
          label: { type: 'text', required: true },
          href: { type: 'text', required: true }
        }
      }
    }
  },

  hero: {
    type: 'hero',
    name: 'Hero Section',
    layouts: ['full-width', 'split', 'centered'],
    defaultLayout: 'full-width',
    htmlTemplates: {
      'full-width': `<section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
  <div class="container mx-auto px-6 text-center">
    <h1 class="text-5xl md:text-7xl font-bold text-white mb-4">{{name}}</h1>
    <p class="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">{{bio}}</p>
    <div class="flex gap-4 justify-center">
      <a href="#contact" class="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium">Get In Touch</a>
      <a href="#projects" class="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition font-medium border border-white/20">View Projects</a>
    </div>
  </div>
</section>`,
      'split': `<section class="min-h-screen flex items-center bg-gradient-to-br from-primary/20 to-purple-500/20">
  <div class="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
    <div>
      <h1 class="text-5xl md:text-6xl font-bold text-white mb-4">{{name}}</h1>
      <p class="text-xl text-white/80 mb-8">{{bio}}</p>
      <div class="flex gap-4">
        <a href="#contact" class="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium">Contact Me</a>
        <a href="#projects" class="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition font-medium">Projects</a>
      </div>
    </div>
    <div class="flex justify-center">
      <img src="{{photo}}" alt="{{name}}" class="w-64 h-64 rounded-full border-4 border-white/20" />
    </div>
  </div>
</section>`,
      'centered': `<section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
  <div class="container mx-auto px-6 text-center max-w-3xl">
    <img src="{{photo}}" alt="{{name}}" class="w-32 h-32 rounded-full border-4 border-white/20 mx-auto mb-6" />
    <h1 class="text-5xl md:text-6xl font-bold text-white mb-4">{{name}}</h1>
    <p class="text-xl text-white/80 mb-8">{{bio}}</p>
    <a href="#contact" class="px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium inline-block">Get Started</a>
  </div>
</section>`
    },
    configurable: {
      backgroundColor: { 
        type: 'color', 
        default: 'gradient',
        options: [
          { value: 'gradient', label: 'Gradient', class: 'bg-gradient-to-br from-primary/20 to-purple-500/20' },
          { value: 'white/10', label: 'White 10%', class: 'bg-white/10' },
          { value: 'white/20', label: 'White 20%', class: 'bg-white/20' },
          { value: 'black/50', label: 'Black 50%', class: 'bg-black/50' },
          { value: 'primary/20', label: 'Primary 20%', class: 'bg-primary/20' },
          { value: 'transparent', label: 'Transparent', class: 'bg-transparent' }
        ]
      },
      title: { type: 'text', maxLength: 100, required: true, default: '{{name}}' },
      subtitle: { type: 'text', maxLength: 200, default: '{{bio}}' },
      ctaButton: {
        text: { type: 'text', maxLength: 30, default: 'Get In Touch' },
        style: { type: 'select', options: ['primary', 'secondary', 'outline'], default: 'primary' },
        link: { type: 'text', maxLength: 200, default: '#contact' }
      },
      showPhoto: { type: 'boolean', default: false }
    }
  },

  about: {
    type: 'about',
    name: 'About Me',
    layouts: ['simple', 'card', 'timeline'],
    defaultLayout: 'simple',
    htmlTemplates: {
      'simple': `<!-- [ABOUT] [OPTIONAL] About Me -->
<section id="about" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-8 text-center">About Me</h2>
    <div class="max-w-3xl mx-auto">
      <p class="text-lg text-white/80 leading-relaxed">{{bio}}</p>
    </div>
  </div>
</section>`,
      'card': `<!-- [ABOUT] [OPTIONAL] About Me -->
<section id="about" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">About Me</h2>
    <div class="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
      <p class="text-lg text-white/80 leading-relaxed">{{bio}}</p>
    </div>
  </div>
</section>`,
      'timeline': `<section id="about" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">About Me</h2>
    <div class="max-w-3xl mx-auto">
      <div class="border-l-4 border-primary pl-8">
        <p class="text-lg text-white/80 leading-relaxed">{{bio}}</p>
      </div>
    </div>
  </div>
</section>`
    },
    configurable: {
      title: { type: 'text', maxLength: 100, default: 'About Me' },
      content: { type: 'text', maxLength: 1000, default: '{{bio}}' }
    }
  },

  experience: {
    type: 'experience',
    name: 'Work Experience',
    layouts: ['list', 'timeline', 'grid'],
    defaultLayout: 'list',
    htmlTemplates: {
      'list': `<!-- [EXPERIENCE] [OPTIONAL] Work Experience -->
<section id="experience" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Work Experience</h2>
    <div class="max-w-4xl mx-auto space-y-8">
      {{experience}}
    </div>
  </div>
</section>`,
      'timeline': `<!-- [EXPERIENCE] [OPTIONAL] Work Experience -->
<section id="experience" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Work Experience</h2>
    <div class="max-w-4xl mx-auto">
      <div class="relative">
        <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30"></div>
        <div class="space-y-12">
          {{experience}}
        </div>
      </div>
    </div>
  </div>
</section>`,
      'grid': `<!-- [EXPERIENCE] [OPTIONAL] Work Experience -->
<section id="experience" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Work Experience</h2>
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
      {{experience}}
    </div>
  </div>
</section>`
    },
    configurable: {
      backgroundColor: { 
        type: 'color', 
        default: 'white/5',
        options: [
          { value: 'white/5', label: 'White 5%', class: 'bg-white/5' },
          { value: 'white/10', label: 'White 10%', class: 'bg-white/10' },
          { value: 'white/20', label: 'White 20%', class: 'bg-white/20' },
          { value: 'black/50', label: 'Black 50%', class: 'bg-black/50' },
          { value: 'primary/20', label: 'Primary 20%', class: 'bg-primary/20' },
          { value: 'transparent', label: 'Transparent', class: 'bg-transparent' }
        ]
      },
      title: { type: 'text', maxLength: 100, default: 'Work Experience' },
      showDates: { type: 'boolean', default: true }
    }
  },

  education: {
    type: 'education',
    name: 'Education',
    layouts: ['list', 'card', 'timeline'],
    defaultLayout: 'list',
    htmlTemplates: {
      'list': `<!-- [EDUCATION] [OPTIONAL] Education -->
<section id="education" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Education</h2>
    <div class="max-w-4xl mx-auto space-y-6">
      {{education}}
    </div>
  </div>
</section>`,
      'card': `<!-- [EDUCATION] [OPTIONAL] Education -->
<section id="education" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Education</h2>
    <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
      {{education}}
    </div>
  </div>
</section>`,
      'timeline': `<!-- [EDUCATION] [OPTIONAL] Education -->
<section id="education" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Education</h2>
    <div class="max-w-4xl mx-auto">
      <div class="border-l-4 border-primary pl-8 space-y-8">
        {{education}}
      </div>
    </div>
  </div>
</section>`
    },
    configurable: {
      backgroundColor: { 
        type: 'color', 
        default: 'white/5',
        options: [
          { value: 'white/5', label: 'White 5%', class: 'bg-white/5' },
          { value: 'white/10', label: 'White 10%', class: 'bg-white/10' },
          { value: 'white/20', label: 'White 20%', class: 'bg-white/20' },
          { value: 'black/50', label: 'Black 50%', class: 'bg-black/50' },
          { value: 'primary/20', label: 'Primary 20%', class: 'bg-primary/20' },
          { value: 'transparent', label: 'Transparent', class: 'bg-transparent' }
        ]
      },
      title: { type: 'text', maxLength: 100, default: 'Education' },
      showGPA: { type: 'boolean', default: true }
    }
  },

  skills: {
    type: 'skills',
    name: 'Skills',
    layouts: ['tags', 'grid', 'progress'],
    defaultLayout: 'tags',
    htmlTemplates: {
      'tags': `<!-- [SKILLS] [OPTIONAL] Skills -->
<section id="skills" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Skills</h2>
    <div class="max-w-4xl mx-auto flex flex-wrap gap-3 justify-center">
      {{skills}}
    </div>
  </div>
</section>`,
      'grid': `<!-- [SKILLS] [OPTIONAL] Skills -->
<section id="skills" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Skills</h2>
    <div class="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
      {{skills}}
    </div>
  </div>
</section>`,
      'progress': `<!-- [SKILLS] [OPTIONAL] Skills -->
<section id="skills" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Skills</h2>
    <div class="max-w-4xl mx-auto space-y-4">
      {{skills}}
    </div>
  </div>
</section>`
    },
    configurable: {
      backgroundColor: { 
        type: 'color', 
        default: 'white/5',
        options: [
          { value: 'white/5', label: 'White 5%', class: 'bg-white/5' },
          { value: 'white/10', label: 'White 10%', class: 'bg-white/10' },
          { value: 'white/20', label: 'White 20%', class: 'bg-white/20' },
          { value: 'black/50', label: 'Black 50%', class: 'bg-black/50' },
          { value: 'primary/20', label: 'Primary 20%', class: 'bg-primary/20' },
          { value: 'transparent', label: 'Transparent', class: 'bg-transparent' }
        ]
      },
      title: { type: 'text', maxLength: 100, default: 'Skills' },
      showLevel: { type: 'boolean', default: false }
    }
  },

  projects: {
    type: 'projects',
    name: 'Projects',
    layouts: ['grid', 'list', 'masonry'],
    defaultLayout: 'grid',
    htmlTemplates: {
      'grid': `<!-- [PROJECTS] [OPTIONAL] Projects -->
<section id="projects" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Projects</h2>
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {{projects}}
    </div>
  </div>
</section>`,
      'list': `<!-- [PROJECTS] [OPTIONAL] Projects -->
<section id="projects" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Projects</h2>
    <div class="max-w-4xl mx-auto space-y-6">
      {{projects}}
    </div>
  </div>
</section>`,
      'masonry': `<!-- [PROJECTS] [OPTIONAL] Projects -->
<section id="projects" class="py-20 bg-white/5">
  <div class="container mx-auto px-6">
    <h2 class="text-4xl font-bold text-white mb-12 text-center">Projects</h2>
    <div class="max-w-6xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6">
      {{projects}}
    </div>
  </div>
</section>`
    },
    configurable: {
      backgroundColor: { 
        type: 'color', 
        default: 'white/5',
        options: [
          { value: 'white/5', label: 'White 5%', class: 'bg-white/5' },
          { value: 'white/10', label: 'White 10%', class: 'bg-white/10' },
          { value: 'white/20', label: 'White 20%', class: 'bg-white/20' },
          { value: 'black/50', label: 'Black 50%', class: 'bg-black/50' },
          { value: 'primary/20', label: 'Primary 20%', class: 'bg-primary/20' },
          { value: 'transparent', label: 'Transparent', class: 'bg-transparent' }
        ]
      },
      title: { type: 'text', maxLength: 100, default: 'Projects' },
      showTechnologies: { type: 'boolean', default: true }
    }
  },

  footer: {
    type: 'footer',
    name: 'Footer',
    layouts: ['simple', 'links', 'social'],
    defaultLayout: 'simple',
    htmlTemplates: {
      'simple': `<!-- [FOOTER] Footer -->
<footer class="bg-white/10 backdrop-blur-md border-t border-white/20 py-8">
  <div class="container mx-auto px-6 text-center">
    <p class="text-white/60">&copy; 2024 {{name}}. All rights reserved.</p>
  </div>
</footer>`,
      'links': `<!-- [FOOTER] Footer -->
<footer class="bg-white/10 backdrop-blur-md border-t border-white/20 py-12">
  <div class="container mx-auto px-6">
    <div class="grid md:grid-cols-3 gap-8 mb-8">
      <div>
        <h3 class="text-white font-semibold mb-4">Quick Links</h3>
        <ul class="space-y-2">
          <li><a href="#about" class="text-white/60 hover:text-white transition">About</a></li>
          <li><a href="#experience" class="text-white/60 hover:text-white transition">Experience</a></li>
          <li><a href="#projects" class="text-white/60 hover:text-white transition">Projects</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-white font-semibold mb-4">Contact</h3>
        <ul class="space-y-2">
          <li class="text-white/60">{{email}}</li>
          <li class="text-white/60">{{phone}}</li>
        </ul>
      </div>
      <div>
        <h3 class="text-white font-semibold mb-4">Follow</h3>
        <ul class="space-y-2">
          {{#if linkedin}}<li><a href="{{linkedin}}" class="text-white/60 hover:text-white transition">LinkedIn</a></li>{{/if}}
          {{#if github}}<li><a href="{{github}}" class="text-white/60 hover:text-white transition">GitHub</a></li>{{/if}}
        </ul>
      </div>
    </div>
    <div class="text-center text-white/60">
      <p>&copy; 2024 {{name}}. All rights reserved.</p>
    </div>
  </div>
</footer>`,
      'social': `<!-- [FOOTER] Footer -->
<footer class="bg-white/10 backdrop-blur-md border-t border-white/20 py-12">
  <div class="container mx-auto px-6 text-center">
    <div class="flex justify-center gap-6 mb-6">
      {{#if email}}<a href="mailto:{{email}}" class="text-white/60 hover:text-white transition">Email</a>{{/if}}
      {{#if linkedin}}<a href="{{linkedin}}" class="text-white/60 hover:text-white transition">LinkedIn</a>{{/if}}
      {{#if github}}<a href="{{github}}" class="text-white/60 hover:text-white transition">GitHub</a>{{/if}}
      {{#if website}}<a href="{{website}}" class="text-white/60 hover:text-white transition">Website</a>{{/if}}
    </div>
    <p class="text-white/60">&copy; 2024 {{name}}. All rights reserved.</p>
  </div>
</footer>`
    },
    configurable: {
      backgroundColor: { 
        type: 'color', 
        default: 'white/10',
        options: [
          { value: 'white/10', label: 'White 10%', class: 'bg-white/10' },
          { value: 'white/20', label: 'White 20%', class: 'bg-white/20' },
          { value: 'black/50', label: 'Black 50%', class: 'bg-black/50' },
          { value: 'primary/20', label: 'Primary 20%', class: 'bg-primary/20' },
          { value: 'transparent', label: 'Transparent', class: 'bg-transparent' }
        ]
      },
      showCopyright: { type: 'boolean', default: true },
      showSocialLinks: { type: 'boolean', default: true }
    }
  }
};

// Helper function untuk mendapatkan preset berdasarkan type
export function getSectionPreset(type) {
  return SECTION_PRESETS[type] || null;
}

// Helper function untuk mendapatkan semua available section types
export function getAvailableSectionTypes() {
  return Object.keys(SECTION_PRESETS);
}

// Helper function untuk mendapatkan HTML template berdasarkan type dan layout
export function getSectionTemplate(type, layout) {
  const preset = getSectionPreset(type);
  if (!preset) return '';
  
  const template = preset.htmlTemplates[layout] || preset.htmlTemplates[preset.defaultLayout];
  return template || '';
}

