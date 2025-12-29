// Template parser utility
// Parse HTML template dan extract sections

export function parseTemplate(htmlTemplate) {
  const errors = [];
  const warnings = [];
  const sections = [];
  let headContent = "";
  let bodyAttributes = "";

  try {
    // Extract head content
    const headMatch = htmlTemplate.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      headContent = headMatch[1].trim();
    } else {
      warnings.push("No <head> tag found");
    }

    // Extract body attributes
    const bodyTagMatch = htmlTemplate.match(/<body([^>]*)>/i);
    if (bodyTagMatch) {
      bodyAttributes = bodyTagMatch[1].trim();
    }

    // Extract body content
    const bodyMatch = htmlTemplate.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) {
      errors.push("No <body> tag found in template");
      return { sections, headContent, bodyAttributes, errors, warnings };
    }

    const bodyContent = bodyMatch[1];

    // Parse sections using markers: <!-- [SECTION_TYPE] [OPTIONAL] Section Name -->
    // Fix: Collect all markers first to avoid infinite loop with regex lastIndex
    const sectionPattern = /<!--\s*\[([A-Z_]+)\]\s*(?:\[OPTIONAL\])?\s*(.*?)\s*-->/gi;
    const sectionMarkers = [];
    let match;

    // First pass: Find all section markers
    while ((match = sectionPattern.exec(bodyContent)) !== null) {
      const sectionType = match[1].toLowerCase();
      const sectionName = match[2].trim() || sectionType;
      const isOptional = match[0].includes("[OPTIONAL]");

      sectionMarkers.push({
        type: sectionType,
        name: sectionName,
        isOptional,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    // Second pass: Extract HTML content between markers
    let order = 1;
    for (let i = 0; i < sectionMarkers.length; i++) {
      const marker = sectionMarkers[i];
      const nextMarker = sectionMarkers[i + 1];

      // Find section content (dari setelah comment sampai sebelum comment berikutnya)
      const sectionStart = marker.endIndex;
      const sectionEnd = nextMarker ? nextMarker.startIndex : bodyContent.length;

      // Extract HTML content dari section
      const htmlContent = bodyContent.substring(sectionStart, sectionEnd).trim();

      if (!htmlContent) {
        warnings.push(`Section "${marker.name}" (${marker.type}) is empty`);
      }

      sections.push({
        type: marker.type,
        name: marker.name,
        htmlContent,
        order,
        isOptional: marker.isOptional,
        condition: null,
      });

      order++;
    }

    if (sections.length === 0) {
      warnings.push("No sections found. Make sure to use section markers: <!-- [SECTION_TYPE] Section Name -->");
    }

    // Validate section types
    const validTypes = [
      "header",
      "hero",
      "about",
      "experience",
      "education",
      "skills",
      "projects",
      "footer",
      "custom",
    ];

    sections.forEach((section) => {
      if (!validTypes.includes(section.type)) {
        warnings.push(`Unknown section type: ${section.type}`);
      }
    });
  } catch (error) {
    errors.push(`Parse error: ${error.message}`);
  }

  return {
    sections,
    headContent,
    bodyAttributes,
    errors,
    warnings,
  };
}

