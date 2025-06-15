import { reviewAccessibility } from './tools/reviewAccessibility.js';
import { suggestAriaRoles } from './tools/suggestAriaRoles.js';
import { checkKeyboardSupport } from './tools/checkKeyboardSupport.js';
import { convertToSemanticHTML } from './tools/convertToSemanticHTML.js';
import { highlightWCAGViolations } from './tools/highlightWCAGViolations.js';

const tools = {
  reviewAccessibility,
  suggestAriaRoles,
  checkKeyboardSupport,
  convertToSemanticHTML,
  highlightWCAGViolations,
};

export async function routeTool(toolName, args) {
  console.log(`Routing to tool: ${toolName}`);
  const toolFunction = tools[toolName];

  if (!toolFunction) {
    throw new Error(`Tool "${toolName}" not found.`);
  }

  const result = await toolFunction(...args);
  console.log("Tool result:", result);
  return result;
}
