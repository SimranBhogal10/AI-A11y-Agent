import { groqChat } from '../llm/groqClient.js';

export async function highlightWCAGViolations(code, language = "html") {
  const prompt = `
Analyze the following ${language} code for WCAG 2.1 accessibility violations.
Provide improved code with necessary changes, without explanations. Ensure the code is in proper ${language} format.

\`\`\`${language}
${code}
\`\`\`
`;

  return await groqChat(prompt);
}
