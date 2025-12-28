/**
 * Generate dummy data untuk preview template
 */
export function generateDummyData(fields = []) {
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

/**
 * Fill template dengan data
 */
export function fillTemplate(template, data) {
  if (!template) return "";

  let filled = template;

  // Replace simple fields
  if (data.personalInfo) {
    const info = data.personalInfo;
    filled = filled.replace(/\{\{name\}\}/g, info.name || "");
    filled = filled.replace(/\{\{email\}\}/g, info.email || "");
    filled = filled.replace(/\{\{phone\}\}/g, info.phone || "");
    filled = filled.replace(/\{\{address\}\}/g, info.address || "");
    filled = filled.replace(/\{\{website\}\}/g, info.website || "");
    filled = filled.replace(/\{\{linkedin\}\}/g, info.linkedin || "");
    filled = filled.replace(/\{\{github\}\}/g, info.github || "");
    filled = filled.replace(/\{\{bio\}\}/g, info.bio || "");
  }

  // Replace arrays
  if (data.skills && Array.isArray(data.skills)) {
    const skillsHtml = data.skills.map(s => `<li>${s.name || s}</li>`).join("");
    filled = filled.replace(/\{\{skills\}\}/g, `<ul>${skillsHtml}</ul>`);
  }

  if (data.experience && Array.isArray(data.experience)) {
    const expHtml = data.experience.map(exp => 
      `<div><h3>${exp.position || ""} at ${exp.company || ""}</h3><p>${exp.description || ""}</p></div>`
    ).join("");
    filled = filled.replace(/\{\{experience\}\}/g, expHtml);
  }

  if (data.education && Array.isArray(data.education)) {
    const eduHtml = data.education.map(edu => 
      `<div><h3>${edu.degree || ""} in ${edu.field || ""}</h3><p>${edu.institution || ""}</p></div>`
    ).join("");
    filled = filled.replace(/\{\{education\}\}/g, eduHtml);
  }

  if (data.projects && Array.isArray(data.projects)) {
    const projHtml = data.projects.map(proj => 
      `<div><h3>${proj.name || ""}</h3><p>${proj.description || ""}</p></div>`
    ).join("");
    filled = filled.replace(/\{\{projects\}\}/g, projHtml);
  }

  return filled;
}

/**
 * Render template dengan sections
 */
export function renderTemplateWithSections(sections, data, options = {}, template = null) {
  const { includeWrapper = true } = options;
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  
  let html = "";
  
  let headContent = template?.headContent || "";
  let bodyAttributes = template?.bodyAttributes || "";
  
  if (includeWrapper) {
    html = `<!DOCTYPE html>
<html>
<head>
${headContent}
</head>
<body${bodyAttributes ? ` ${bodyAttributes}` : ""}>
<div class="container">`;
  }

  for (const section of sortedSections) {
    let sectionHtml = section.htmlContent || "";
    sectionHtml = fillTemplate(sectionHtml, data);
    html += sectionHtml;
  }

  if (includeWrapper) {
    html += `
</div>
</body>
</html>`;
  }

  return html;
}

