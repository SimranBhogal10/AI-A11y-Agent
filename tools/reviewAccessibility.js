import { groqChat } from '../llm/groqClient.js';

export async function reviewAccessibility(code, language = "html") {
  const prompt = `
You are an expert in web accessibility. Analyze the following ${language} code for:
- Semantic HTML
- ARIA usage
- Keyboard navigation
- WCAG 2.1 compliance

Provide improved code with necessary changes, without explanations. Ensure the code is in proper ${language} format.

\`\`\`${language}
${code}
\`\`\`
`;

  return await groqChat(prompt);
}
