// Template filler utility
// Following rules.md: Business logic di lib/

/**
 * Render template dengan sections (modular approach)
 * @param {Array} sections - Array of TemplateSection objects (ordered by order field)
 * @param {Object} data - CV data object
 * @param {Object} options - Options untuk rendering
 * @param {Object} template - Template object (optional, untuk headContent dan bodyAttributes)
 * @returns {string} - Complete HTML dengan sections yang di-render
 */
export function renderTemplateWithSections(sections, data, options = {}, template = null) {
  const { includeWrapper = true, wrapperClass = "" } = options;
  
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  let html = "";
  
  // Extract headContent dan bodyAttributes dari template jika tersedia
  let headContent = "";
  let bodyAttributes = "";
  
  // Check jika headContent dan bodyAttributes sudah langsung tersedia (untuk upload preview)
  if (template?.headContent) {
    headContent = template.headContent;
  }
  if (template?.bodyAttributes) {
    bodyAttributes = template.bodyAttributes;
  }
  
  // Jika belum ada, coba extract dari htmlTemplate (untuk template dari database)
  if (!headContent && !bodyAttributes && (template?.html_template || template?.htmlTemplate)) {
    const htmlTemplate = template.html_template || template.htmlTemplate;
    try {
      // Coba parse sebagai JSON (format baru dengan metadata)
      const metadata = JSON.parse(htmlTemplate);
      if (metadata.headContent) {
        headContent = metadata.headContent;
      }
      if (metadata.bodyAttributes) {
        bodyAttributes = metadata.bodyAttributes;
      }
    } catch (e) {
      // Jika bukan JSON, extract dari htmlTemplate langsung (backward compatibility)
      const headMatch = htmlTemplate.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      if (headMatch) {
        headContent = headMatch[1];
      }
      const bodyTagMatch = htmlTemplate.match(/<body([^>]*)>/i);
      if (bodyTagMatch) {
        bodyAttributes = bodyTagMatch[1];
      }
    }
  }
  
  // Add wrapper HTML jika diperlukan
  if (includeWrapper) {
    // Gunakan headContent dari template jika tersedia, jika tidak gunakan default minimal
    const finalHeadContent = headContent || `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template?.name || "Template Preview"} - ${data.personalInfo?.name || "Portfolio"}</title>
  <link rel="icon" href="/MainLogo.png" type="image/png" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.6s ease-out; }
  </style>`;
    
    // Gunakan bodyAttributes dari template jika tersedia
    // bodyAttributes dari parser adalah string seperti: ' class="bg-black text-green-400 min-h-screen relative overflow-x-hidden"'
    let bodyTag = "<body";
    if (bodyAttributes && bodyAttributes.trim()) {
      // bodyAttributes sudah dalam format yang benar dari parser (termasuk spasi di awal)
      // Pastikan selalu ada spasi sebelum attributes
      const trimmedAttrs = bodyAttributes.trim();
      bodyTag += ` ${trimmedAttrs}`; // Tambahkan spasi sebelum attributes
    } else if (wrapperClass) {
      bodyTag += ` class="${wrapperClass}"`;
    }
    bodyTag += ">";
    
    html += `<!DOCTYPE html>
<html lang="id">
<head>${finalHeadContent}
</head>
${bodyTag}
  <div class="min-h-screen">`;
  }
  
  // Separate custom sections dari template sections
  // Custom sections memiliki id yang dimulai dengan 'custom-' atau type === 'custom' dengan id custom
  const templateSections = sortedSections.filter(s => {
    const isCustom = s.id?.startsWith('custom-') || (s.type === 'custom' && s.id?.startsWith('custom-'));
    return !isCustom;
  });
  const customSections = sortedSections.filter(s => {
    return s.id?.startsWith('custom-') || (s.type === 'custom' && s.id?.includes('custom-'));
  });
  
  // Check if there's a dynamic slot section
  // Check both htmlContent and type for dynamic_slot
  const hasDynamicSlot = templateSections.some(s => {
    const htmlContent = s.htmlContent || s.html_content || "";
    const hasPlaceholder = htmlContent.includes('{{customSections}}');
    const isDynamicSlotType = s.type === 'dynamic_slot' || s.type === 'DYNAMIC_SLOT';
    return hasPlaceholder || isDynamicSlotType;
  });
  
  // Render setiap template section
  for (const section of templateSections) {
    // Check condition jika ada
    if (section.condition) {
      const conditionType = section.condition.replace("if:", "");
      const hasData = checkSectionData(data, conditionType);
      
      // Skip jika isOptional dan data tidak ada
      if (section.isOptional && !hasData) {
        continue;
      }
      
      // Skip jika condition tidak terpenuhi
      if (!hasData) {
        continue;
      }
    }
    
    // Check dan replace {{customSections}} placeholder SEBELUM fillTemplate
    // karena fillTemplate akan menghapus placeholder yang tidak dikenal
    let sectionHtml = section.htmlContent || section.html_content || "";
    
    // Clean up metadata yang tidak seharusnya di-render (form definition metadata)
    // Pattern: map[description: label:...] atau map[description: ...]
    // Ini biasanya muncul dari template sections yang mengandung metadata form definition
    sectionHtml = sectionHtml.replace(/map\[description:\s*[^\]]*\]/gi, "");
    sectionHtml = sectionHtml.replace(/map\[[^\]]*description[^\]]*\]/gi, "");
    
    // Clean up conditional markers yang tidak seharusnya di-render
    sectionHtml = sectionHtml.replace(/label:\s*#?if\s+[^\s]*/gi, "");
    sectionHtml = sectionHtml.replace(/label:\s*\/if/gi, "");
    
    // Clean up field metadata yang tidak seharusnya di-render
    sectionHtml = sectionHtml.replace(/required:\s*(true|false)/gi, "");
    sectionHtml = sectionHtml.replace(/type:\s*[a-z]+/gi, "");
    
    let hasCustomSectionsPlaceholder = sectionHtml.includes('{{customSections}}');
    
    // Jika ada placeholder {{customSections}}, replace dulu sebelum fillTemplate
    if (hasCustomSectionsPlaceholder && customSections.length > 0) {
      // Generate custom sections HTML
      const customSectionsHtml = customSections
        .map(customSection => {
          // Fill custom section dengan data
          const filledCustomSection = fillTemplate(customSection.htmlContent || customSection.html_content || "", data);
          return filledCustomSection;
        })
        .join('\n');
      
      // Replace placeholder dengan custom sections HTML
      sectionHtml = sectionHtml.replace('{{customSections}}', customSectionsHtml);
    } else if (hasCustomSectionsPlaceholder) {
      // Jika placeholder ada tapi tidak ada custom sections, remove placeholder
      sectionHtml = sectionHtml.replace('{{customSections}}', '');
    }
    
    // Fill section HTML dengan data (setelah {{customSections}} sudah di-replace)
    let filledSection = fillTemplate(sectionHtml, data);
    
    html += filledSection;
  }
  
  // Render custom sections yang tidak di-inject ke placeholder
  // (untuk backward compatibility jika tidak ada dynamic slot)
  if (!hasDynamicSlot && customSections.length > 0) {
    // Render custom sections di akhir (sebelum footer)
    for (const customSection of customSections) {
      const filledCustomSection = fillTemplate(customSection.htmlContent || customSection.html_content || "", data);
      html += filledCustomSection;
    }
  }
  
  // Close wrapper
  if (includeWrapper) {
    html += `
  </div>
</body>
</html>`;
  }
  
  return html;
}

/**
 * Check apakah data untuk section tertentu tersedia
 * @param {Object} data - CV data object
 * @param {string} sectionType - Type section (experience, projects, etc.)
 * @returns {boolean}
 */
function checkSectionData(data, sectionType) {
  switch (sectionType) {
    case "experience":
      return !!(data.experience && Array.isArray(data.experience) && data.experience.length > 0);
    case "projects":
      return !!(data.projects && Array.isArray(data.projects) && data.projects.length > 0);
    case "education":
      return !!(data.education && Array.isArray(data.education) && data.education.length > 0);
    case "skills":
      return !!(data.skills && Array.isArray(data.skills) && data.skills.length > 0);
    case "about":
    case "bio":
      return !!(data.personalInfo?.bio);
    case "contact":
      return !!(data.personalInfo?.email || data.personalInfo?.phone);
    default:
      return true; // Default: always render
  }
}

/**
 * Fill template dengan data CV
 * @param {string} template - HTML template dengan placeholder {{key}}
 * @param {Object} data - CV data object
 * @returns {string} - Filled template
 */
export function fillTemplate(template, data) {
  // Handle null/undefined template
  if (!template) {
    console.warn("⚠️ [Template Filler] Template is null or undefined");
    return "";
  }
  
  let filled = template;

  // Helper untuk format array/list
  const formatArray = (arr, formatFn) => {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr.map(formatFn).join("\n");
  };

  // Replace simple fields
  if (data.personalInfo) {
    const info = data.personalInfo;
    // Escape special characters untuk replacement yang aman
    const escapeHtml = (text) => {
      if (!text) return "";
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, (m) => map[m]);
    };
    
    // Replace dengan escape HTML untuk mencegah XSS dan memastikan rendering yang benar
    filled = filled.replace(/\{\{name\}\}/g, escapeHtml(info.name || ""));
    filled = filled.replace(/\{\{email\}\}/g, escapeHtml(info.email || ""));
    filled = filled.replace(/\{\{phone\}\}/g, escapeHtml(info.phone || ""));
    filled = filled.replace(/\{\{address\}\}/g, escapeHtml(info.address || ""));
    filled = filled.replace(/\{\{website\}\}/g, escapeHtml(info.website || ""));
    filled = filled.replace(/\{\{linkedin\}\}/g, escapeHtml(info.linkedin || ""));
    filled = filled.replace(/\{\{github\}\}/g, escapeHtml(info.github || ""));
    // Bio bisa mengandung HTML, jadi tidak di-escape jika sudah HTML
    filled = filled.replace(/\{\{bio\}\}/g, info.bio || "");
    filled = filled.replace(/\{\{photo\}\}/g, info.photo || "");
    
    // Support JavaScript expressions untuk name
    // {{name.substring(0,1)}} atau {{name.[0]}} untuk karakter pertama
    const nameValue = info.name || "";
    filled = filled.replace(/\{\{name\.substring\(0,1\)\}\}/g, escapeHtml(nameValue.charAt(0) || ""));
    filled = filled.replace(/\{\{name\.\[0\]\}\}/g, escapeHtml(nameValue.charAt(0) || ""));
    filled = filled.replace(/\{\{name\.charAt\(0\)\}\}/g, escapeHtml(nameValue.charAt(0) || ""));
    
    // Support nested format: {{personalInfo.name}}
    filled = filled.replace(/\{\{personalInfo\.name\}\}/g, escapeHtml(info.name || ""));
    filled = filled.replace(/\{\{personalInfo\.email\}\}/g, escapeHtml(info.email || ""));
    filled = filled.replace(/\{\{personalInfo\.phone\}\}/g, escapeHtml(info.phone || ""));
    filled = filled.replace(/\{\{personalInfo\.bio\}\}/g, info.bio || "");
  }

  // Handle conditional elements (hide if value is empty)
  // Elements with class "conditional-link" or "conditional-phone" will be hidden if href/content is empty
  if (data.personalInfo) {
    const info = data.personalInfo;
    
    // Hide conditional links if href is empty
    filled = filled.replace(/<a([^>]*class="[^"]*conditional-link[^"]*"[^>]*href=")([^"]*)"([^>]*)>/g, (match, before, href, after) => {
      if (!href || href.trim() === '') {
        return match.replace('class="', 'class="hidden ').replace('style="', 'style="display: none; ');
      }
      return match;
    });
    
    // Hide conditional phone if value is empty
    filled = filled.replace(/<([^>]*class="[^"]*conditional-phone[^"]*"[^>]*)>([^<]*)<\/[^>]*>/g, (match, tag, content) => {
      if (!content || content.trim() === '') {
        return match.replace('class="', 'class="hidden ').replace('style="', 'style="display: none; ');
      }
      return match;
    });
  }

  // Replace skills array
  if (data.skills && Array.isArray(data.skills)) {
    const escapeHtml = (text) => {
      if (!text) return "";
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, (m) => map[m]);
    };
    
    const skillsHtml = formatArray(data.skills, (skill) => {
      const skillName = typeof skill === "string" ? skill : skill.name;
      const escapedName = escapeHtml(skillName || "");
      // Default style (for Modern Minimalist)
      return `<span class="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">${escapedName}</span>`;
    });
    filled = filled.replace(/\{\{skills\}\}/g, skillsHtml);
    
    // Also create colorful version for Creative Professional template
    const skillsHtmlColorful = formatArray(data.skills, (skill) => {
      const skillName = typeof skill === "string" ? skill : skill.name;
      return `<span class="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white rounded-lg text-sm font-medium border border-purple-400/30 backdrop-blur-sm">${skillName}</span>`;
    });
    filled = filled.replace(/\{\{skills-colorful\}\}/g, skillsHtmlColorful);
  }

  // Replace experience array
  if (data.experience && Array.isArray(data.experience)) {
    const escapeHtml = (text) => {
      if (!text) return "";
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, (m) => map[m]);
    };
    
    const experienceHtml = formatArray(data.experience, (exp) => {
      const dateRange = exp.current
        ? `${exp.startDate || ""} - Present`
        : `${exp.startDate || ""} - ${exp.endDate || ""}`;
      // Default style (for Modern Minimalist)
      const position = escapeHtml(exp.position || "");
      const company = escapeHtml(exp.company || "");
      const escapedDateRange = escapeHtml(dateRange);
      // Description bisa mengandung HTML, jadi tidak di-escape jika sudah HTML
      return `
        <div class="border-l-4 border-primary pl-6 py-4 mb-6">
          <h3 class="text-xl font-semibold mb-2">${position} at ${company}</h3>
          <p class="text-gray-500 mb-3">${escapedDateRange}</p>
          ${exp.description ? `<p class="text-gray-700 leading-relaxed">${exp.description}</p>` : ""}
        </div>
      `;
    });
    filled = filled.replace(/\{\{experience\}\}/g, experienceHtml);
    
    // Colorful version for Creative Professional
    const experienceHtmlColorful = formatArray(data.experience, (exp) => {
      const dateRange = exp.current
        ? `${exp.startDate} - Present`
        : `${exp.startDate || ""} - ${exp.endDate || ""}`;
      return `
        <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 border border-purple-400/30 hover:bg-white/20 transition-all">
          <h3 class="text-xl font-semibold mb-2 text-white">${exp.position} at ${exp.company}</h3>
          <p class="text-purple-200 mb-3">${dateRange}</p>
          ${exp.description ? `<p class="text-gray-200 leading-relaxed">${exp.description}</p>` : ""}
        </div>
      `;
    });
    filled = filled.replace(/\{\{experience-colorful\}\}/g, experienceHtmlColorful);
  }

  // Replace education array
  if (data.education && Array.isArray(data.education)) {
    const escapeHtml = (text) => {
      if (!text) return "";
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, (m) => map[m]);
    };
    
    const educationHtml = formatArray(data.education, (edu) => {
      const dateRange = `${edu.startDate || ""} - ${edu.endDate || ""}`;
      // Default style (for Modern Minimalist)
      const degree = escapeHtml(edu.degree || "");
      const institution = escapeHtml(edu.institution || "");
      const field = edu.field ? escapeHtml(edu.field) : "";
      const escapedDateRange = escapeHtml(dateRange);
      const gpa = edu.gpa ? escapeHtml(String(edu.gpa)) : "";
      return `
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-4">
          <h3 class="text-xl font-semibold mb-2">${degree} - ${institution}</h3>
          ${field ? `<p class="text-gray-600 mb-2">${field}</p>` : ""}
          ${escapedDateRange ? `<p class="text-gray-500 text-sm mb-2">${escapedDateRange}</p>` : ""}
          ${gpa ? `<p class="text-gray-600">GPA: ${gpa}</p>` : ""}
        </div>
      `;
    });
    filled = filled.replace(/\{\{education\}\}/g, educationHtml);
    
    // Colorful version for Creative Professional
    const educationHtmlColorful = formatArray(data.education, (edu) => {
      const dateRange = `${edu.startDate || ""} - ${edu.endDate || ""}`;
      return `
        <div class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-lg p-6 mb-4 border border-purple-400/30">
          <h3 class="text-xl font-semibold mb-2 text-white">${edu.degree} - ${edu.institution}</h3>
          ${edu.field ? `<p class="text-purple-200 mb-2">${edu.field}</p>` : ""}
          ${dateRange ? `<p class="text-purple-300 text-sm mb-2">${dateRange}</p>` : ""}
          ${edu.gpa ? `<p class="text-gray-200">GPA: ${edu.gpa}</p>` : ""}
        </div>
      `;
    });
    filled = filled.replace(/\{\{education-colorful\}\}/g, educationHtmlColorful);
  }

  // Replace projects array
  if (data.projects && Array.isArray(data.projects)) {
    const escapeHtml = (text) => {
      if (!text) return "";
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, (m) => map[m]);
    };
    
    const projectsHtml = formatArray(data.projects, (project) => {
      // Default style (for Modern Minimalist)
      const name = escapeHtml(project.name || "");
      const url = escapeHtml(project.url || "");
      // Description bisa mengandung HTML, jadi tidak di-escape jika sudah HTML
      const technologies = project.technologies 
        ? project.technologies.map(tech => `<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">${escapeHtml(tech)}</span>`).join("")
        : "";
      return `
        <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
          <h3 class="text-xl font-semibold mb-3">${name}</h3>
          ${project.description ? `<p class="text-gray-700 mb-3 leading-relaxed">${project.description}</p>` : ""}
          ${technologies ? `<div class="flex flex-wrap gap-2"><span class="text-sm text-gray-500">Tech:</span> ${technologies}</div>` : ""}
          ${url ? `<a href="${url}" class="mt-4 inline-block text-primary hover:underline" target="_blank" rel="noopener noreferrer">View Project →</a>` : ""}
        </div>
      `;
    });
    filled = filled.replace(/\{\{projects\}\}/g, projectsHtml);
    
    // Colorful version for Creative Professional
    const projectsHtmlColorful = formatArray(data.projects, (project) => {
      return `
        <div class="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-md rounded-lg p-6 border border-purple-400/30 hover:border-purple-400/50 transition-all hover:scale-105">
          <h3 class="text-xl font-semibold mb-3 text-white">${project.name}</h3>
          ${project.description ? `<p class="text-gray-200 mb-3 leading-relaxed">${project.description}</p>` : ""}
          ${project.technologies ? `<div class="flex flex-wrap gap-2"><span class="text-sm text-purple-200">Tech:</span> ${project.technologies.map(tech => `<span class="px-2 py-1 bg-purple-500/30 text-white rounded text-xs border border-purple-400/50">${tech}</span>`).join("")}</div>` : ""}
          ${project.url ? `<a href="${project.url}" class="mt-4 inline-block text-purple-300 hover:text-white transition" target="_blank" rel="noopener noreferrer">View Project →</a>` : ""}
        </div>
      `;
    });
    filled = filled.replace(/\{\{projects-colorful\}\}/g, projectsHtmlColorful);
  }

  // Replace custom data placeholders ({{custom.tabName.fieldName}} atau {{custom.tabName}})
  if (data.custom && typeof data.custom === "object") {
    for (const [tabName, tabData] of Object.entries(data.custom)) {
      if (tabData && typeof tabData === "object" && !Array.isArray(tabData)) {
        // Handle nested custom data (tab dengan fields)
        for (const [fieldName, fieldValue] of Object.entries(tabData)) {
          const placeholder = `{{custom.${tabName}.${fieldName}}}`;
          if (Array.isArray(fieldValue)) {
            // Handle array field value
            const customArrayHtml = formatArray(fieldValue, (item) => {
              const itemValue = typeof item === "string" ? item : item.name || item.value || String(item);
              return `<span class="px-2 py-1 bg-primary/20 text-primary rounded text-sm">${itemValue}</span>`;
            });
            filled = filled.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), customArrayHtml);
          } else {
            // Handle simple field value
            filled = filled.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fieldValue || "");
          }
        }
        
        // Also support {{custom.tabName}} untuk akses seluruh object (JSON stringify)
        const tabPlaceholder = `{{custom.${tabName}}}`;
        filled = filled.replace(new RegExp(tabPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), JSON.stringify(tabData));
      } else if (Array.isArray(tabData)) {
        // Handle array custom data (backward compatibility)
        const customArrayHtml = formatArray(tabData, (item) => {
          const itemValue = typeof item === "string" ? item : item.name || item.value || String(item);
          return `<span class="px-2 py-1 bg-primary/20 text-primary rounded text-sm">${itemValue}</span>`;
        });
        filled = filled.replace(new RegExp(`\\{\{custom\\.${tabName}\\}\}`, 'g'), customArrayHtml);
      } else {
        // Handle simple custom data (backward compatibility)
        filled = filled.replace(new RegExp(`\\{\{custom\\.${tabName}\\}\}`, 'g'), tabData || "");
      }
    }
  }

  // Remove unused placeholders (but keep {{customSections}} and conditional display styles that were already processed)
  // Exclude {{customSections}} from removal as it's handled separately in renderTemplateWithSections
  filled = filled.replace(/\{\{(?!customSections)[^}]+\}\}/g, "");

  // Clean up metadata yang tidak seharusnya di-render (form definition metadata)
  // Pattern: map[description: label:...] atau map[description: ...]
  // Ini biasanya muncul dari template sections yang mengandung metadata form definition
  filled = filled.replace(/map\[description:\s*[^\]]*\]/gi, "");
  
  // Clean up Go map format yang mungkin ter-render sebagai text
  // Pattern: map[key:value key2:value2] atau map[key: value]
  filled = filled.replace(/map\[[^\]]*description[^\]]*\]/gi, "");
  
  // Clean up conditional markers yang tidak seharusnya di-render
  // Pattern: label:#if atau label:/if yang muncul sebagai text
  filled = filled.replace(/label:\s*#?if\s+[^\s]*/gi, "");
  filled = filled.replace(/label:\s*\/if/gi, "");
  
  // Clean up field metadata yang tidak seharusnya di-render
  // Pattern: required:false, type:email, dll yang muncul sebagai text
  filled = filled.replace(/required:\s*(true|false)/gi, "");
  filled = filled.replace(/type:\s*[a-z]+/gi, "");

  return filled;
}

/**
 * Generate dummy data untuk preview template
 * @param {Object|Array} fields - Template fields definition
 * @returns {Object} - Dummy CV data
 */
export function generateDummyData(fields = {}) {
  // Handle jika fields adalah array (format lama)
  if (Array.isArray(fields)) {
    fields = {};
  }

  return {
    personalInfo: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      address: "123 Main St, City, Country",
      website: "https://johndoe.com",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      bio: "Experienced software developer with passion for creating innovative solutions.",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    skills: [
      { name: "JavaScript", level: "advanced" },
      { name: "React", level: "advanced" },
      { name: "Node.js", level: "intermediate" },
      { name: "TypeScript", level: "intermediate" },
    ],
    experience: [
      {
        company: "Tech Corp",
        position: "Senior Software Engineer",
        startDate: "2020-01",
        endDate: "2024-12",
        current: false,
        description: "Led development of multiple web applications",
      },
      {
        company: "Startup Inc",
        position: "Full Stack Developer",
        startDate: "2018-06",
        endDate: "2019-12",
        current: false,
        description: "Built and maintained web applications",
      },
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2014",
        endDate: "2018",
        gpa: "3.8",
      },
    ],
    projects: [
      {
        name: "E-Commerce Platform",
        description: "Full-stack e-commerce solution",
        technologies: ["React", "Node.js", "MongoDB"],
        url: "https://example.com",
      },
    ],
  };
}
