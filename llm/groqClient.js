import * as vscode from "vscode";
import dotenv from "dotenv";
dotenv.config();

const groqApiKey = vscode.workspace.getConfiguration().get("a11yAgent.groqApiKey");

export async function groqChat(prompt) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${groqApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  const data = await res.json();
  console.log("Groq response:", data);
  return data.choices?.[0]?.message?.content || "No response";
}
