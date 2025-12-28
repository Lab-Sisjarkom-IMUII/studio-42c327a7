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
    const sectionPattern = /<!--\s*\[([A-Z_]+)\]\s*(?:\[OPTIONAL\])?\s*(.*?)\s*-->/gi;
    let match;
    let order = 1;

    while ((match = sectionPattern.exec(bodyContent)) !== null) {
      const sectionType = match[1].toLowerCase();
      const sectionName = match[2].trim() || sectionType;
      const isOptional = match[0].includes("[OPTIONAL]");

      // Find the next section marker or end of body
      const nextMatchIndex = sectionPattern.lastIndex;
      sectionPattern.lastIndex = 0;
      const nextMatch = sectionPattern.exec(bodyContent.substring(nextMatchIndex));
      const sectionEndIndex = nextMatch
        ? nextMatchIndex + nextMatch.index
        : bodyContent.length;

      // Extract HTML content between markers
      const sectionStartIndex = match.index + match[0].length;
      const htmlContent = bodyContent
        .substring(sectionStartIndex, sectionEndIndex)
        .trim();

      if (!htmlContent) {
        warnings.push(`Section "${sectionName}" (${sectionType}) is empty`);
      }

      sections.push({
        type: sectionType,
        name: sectionName,
        htmlContent,
        order,
        isOptional,
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

