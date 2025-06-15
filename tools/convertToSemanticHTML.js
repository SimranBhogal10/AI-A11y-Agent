import { groqChat } from '../llm/groqClient.js';

export async function convertToSemanticHTML(code, language = "html") {
  const prompt = `
Convert the following ${language} code into more semantic HTML by replacing non-semantic tags (e.g., <div>, <span>) with appropriate semantic tags (e.g., <header>, <main>, <section>, <article>). 
Provide the improved code without explanation. Provide in proper ${language} format.

\`\`\`${language}
${code}
\`\`\`
`;

  return await groqChat(prompt);
}
