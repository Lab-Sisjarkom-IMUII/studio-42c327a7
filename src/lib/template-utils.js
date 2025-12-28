/**
 * Extract semua placeholder dari HTML string
 */
export function extractPlaceholders(html) {
  if (!html || typeof html !== "string") {
    return [];
  }

  const matches = html.match(/\{\{([^}]+)\}\}/g) || [];
  const keys = matches
    .map((match) => match.replace(/\{\{|\}\}/g, ""))
    .filter((key, index, self) => self.indexOf(key) === index);

  return keys;
}

/**
 * Generate fields array dari array of placeholder keys
 */
export function generateFieldsFromPlaceholders(placeholders) {
  if (!Array.isArray(placeholders) || placeholders.length === 0) {
    return [];
  }

  const fields = placeholders.map((key) => {
    let type = "text";
    if (key.includes("email")) {
      type = "email";
    } else if (key.includes("phone")) {
      type = "phone";
    } else if (
      key === "skills" ||
      key === "experience" ||
      key === "education" ||
      key === "projects" ||
      key === "languages" ||
      key === "certifications"
    ) {
      type = "array";
    } else if (key.includes("date") || key.includes("Date")) {
      type = "date";
    }

    const label =
      key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim() || key.charAt(0).toUpperCase() + key.slice(1);

    return {
      key,
      label,
      type,
      required: false,
      description: null,
    };
  });

  const uniqueFields = Array.from(
    new Map(fields.map((f) => [f.key, f])).values()
  );

  return uniqueFields;
}

/**
 * Generate fields dari template
 */
export function generateFieldsFromTemplate(htmlTemplate) {
  if (!htmlTemplate) {
    return [];
  }
  const placeholders = extractPlaceholders(htmlTemplate);
  return generateFieldsFromPlaceholders(placeholders);
}

