import { routeTool } from "../route.js";
import { extractCodeBlock } from "../helper/llmUtils.js";

export async function runAndMerge(code, language = "html") {
  console.log(`\n--- Running accessibility tools on ${language} code ---\n`);

  const toolsToRun = [
    "highlightWCAGViolations",
    "reviewAccessibility",
    "suggestAriaRoles",
    "checkKeyboardSupport",
    "convertToSemanticHTML",
  ];

  let currentCode = code;

  // Processing tools sequentially
  for (const tool of toolsToRun) {
    try {
      console.log(`Applying tool: ${tool}`);
      const toolOutput = await routeTool(tool, [currentCode, language]);
      const cleanedOutput = extractCodeBlock(toolOutput, language);

      if (cleanedOutput && cleanedOutput !== currentCode) {
        console.log(`  -> Tool "${tool}" made modifications.`);
        currentCode = cleanedOutput;
      } else {
        console.log(`  -> Tool "${tool}" made no changes or returned empty.`);
      }
    } catch (error) {
      console.error(`Error applying tool "${tool}":`, error);
      console.log(`Continuing with previous code due to error in "${tool}".`);
    }
  }

  console.log("\n--- All accessibility tools applied sequentially ---\n");
  return currentCode;
}
