/**
 * Extracts the first code block of a given language from a string
 * @param {string} text - The text containing potential code blocks
 * @param {string} language - The language identifier (e.g., "html", "jsx", "tsx")
 * @returns {string} - The extracted code or the original text if no code block found
 */
export function extractCodeBlock(text, language = "html") {
  // Match the first code block for the given language
  const regex = new RegExp("```" + language + "\\s*([\\s\\S]*?)```", "i");
  const match = text.match(regex);
  if (match) {
    return match[1].trim();
  }
  // Fallback: return the whole text if no code block found
  return text.trim();
}
