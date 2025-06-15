# ♿ Accessibility AI Agent for VS Code

An AI-powered developer assistant for identifying and improving accessibility in web code, directly within Visual Studio Code. Powered by the Groq API and LLaMA 3, this extension helps ensure your code meets WCAG 2.1 standards through intelligent suggestions and semantic improvements.

---

## 🚀 Features

- Analyze and improve HTML, JSX, and similar code for:
  - ✅ Semantic HTML structure
  - ✅ ARIA role suggestions
  - ✅ Keyboard navigation support
  - ✅ WCAG 2.1 compliance
- Inline AI-driven accessibility recommendations
- Opens a new tab with improved version of your code
- Lightweight & fast — runs locally with cloud LLM integration

---

## 🧠 How It Works

This extension uses modular AI tools routed through a lightweight tool router. Each tool handles a specific accessibility concern:

- `reviewAccessibility`: End-to-end review of accessibility issues
- `suggestAriaRoles`: Suggests proper ARIA attributes
- `checkKeyboardSupport`: Reviews keyboard navigability
- `convertToSemanticHTML`: Converts to more semantic tags
- `highlightWCAGViolations`: Flags WCAG issues with reasons

All tools are powered by the Groq API with LLaMA 3 model behind the scenes.

## 📄 License

MIT License  
© 2025 [Simran Bhogal](https://github.com/SimranBhogal10)

---

## 🧑‍💻 Authors

- [Simran Bhogal](https://github.com/SimranBhogal10)  

