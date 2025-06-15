import { groqChat } from '../llm/groqClient.js';

export async function suggestAriaRoles(code, language = "html") {
  const prompt = `
You are an accessibility expert. Review the following ${language} code and suggest ARIA roles to improve accessibility. 
Provide improved code.

\`\`\`${language}
${code}
\`\`\`
`;

  return await groqChat(prompt);
}
