import { groqChat } from '../llm/groqClient.js';

export async function checkKeyboardSupport(code, language = "html") {
  const prompt = `
Check if the following ${language} code supports keyboard navigation (Tab, Enter, Arrow keys, Escape). 
Improve the existing code without explanation in proper ${language} format.

\`\`\`${language}
${code}
\`\`\`
`;

  return await groqChat(prompt);
}
