var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.5.0",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs = require("fs");
    var path2 = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath2) {
      return envPath2[0] === "~" ? path2.join(os.homedir(), envPath2.slice(1)) : envPath2;
    }
    function _configVault(options) {
      const debug = Boolean(options && options.debug);
      if (debug) {
        _debug("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// extension.js
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"), 1);
var import_dotenv2 = __toESM(require_main(), 1);
var import_path = __toESM(require("path"), 1);

// llm/groqClient.js
var import_dotenv = __toESM(require_main(), 1);
import_dotenv.default.config();
async function groqChat(prompt) {
  var _a, _b, _c;
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      // or llama3-70b-8192 if enabled
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });
  const data = await res.json();
  console.log("Groq response:", data);
  return ((_c = (_b = (_a = data.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content) || "No response";
}

// tools/reviewAccessibility.js
async function reviewAccessibility(code, language = "html") {
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
  const response = await groqChat(prompt);
  console.log("\u{1F9E0} Groq Response (reviewAccessibility):", response);
  return response;
}

// tools/suggestAriaRoles.js
async function suggestAriaRoles(code, language = "html") {
  const prompt = `
You are an accessibility expert. Review the following ${language} code and suggest ARIA roles to improve accessibility. 
Provide improved code.

\`\`\`${language}
${code}
\`\`\`
`;
  return await groqChat(prompt);
}

// tools/checkKeyboardSupport.js
async function checkKeyboardSupport(code, language = "html") {
  const prompt = `
Check if the following ${language} code supports keyboard navigation (Tab, Enter, Arrow keys, Escape). 
Improve the existing code without explanation in proper ${language} format.

\`\`\`${language}
${code}
\`\`\`
`;
  return await groqChat(prompt);
}

// tools/convertToSemanticHTML.js
async function convertToSemanticHTML(code, language = "html") {
  const prompt = `
Convert the following ${language} code into more semantic HTML by replacing non-semantic tags (e.g., <div>, <span>) with appropriate semantic tags (e.g., <header>, <main>, <section>, <article>). 
Provide the improved code without explanation. Provide in proper ${language} format.

\`\`\`${language}
${code}
\`\`\`
`;
  return await groqChat(prompt);
}

// tools/highlightWCAGViolations.js
async function highlightWCAGViolations(code, language = "html") {
  const prompt = `
Analyze the following ${language} code for WCAG 2.1 accessibility violations.
Provide improved code with necessary changes, without explanations. Ensure the code is in proper ${language} format.

\`\`\`${language}
${code}
\`\`\`
`;
  return await groqChat(prompt);
}

// route.js
var tools = {
  reviewAccessibility,
  suggestAriaRoles,
  checkKeyboardSupport,
  convertToSemanticHTML,
  highlightWCAGViolations
};
async function routeTool(toolName, args) {
  console.log(`\u{1F6E0}\uFE0F Routing to tool: ${toolName}`);
  const toolFunction = tools[toolName];
  if (!toolFunction) {
    throw new Error(`Tool "${toolName}" not found.`);
  }
  const result = await toolFunction(...args);
  console.log("\u2705 Tool result:", result);
  return result;
}

// tools/index.js
async function runAndMerge(code, language = "html") {
  console.log(`
--- Running accessibility tools on ${language} code ---
`);
  const toolsToRun = [
    "highlightWCAGViolations",
    "reviewAccessibility",
    "suggestAriaRoles",
    "checkKeyboardSupport",
    "convertToSemanticHTML"
  ];
  let currentCode = code;
  for (const tool of toolsToRun) {
    try {
      console.log(`Applying tool: ${tool}`);
      const toolOutput = await routeTool(tool, [currentCode, language]);
      if (toolOutput && toolOutput !== currentCode) {
        console.log(`  -> Tool "${tool}" made modifications.`);
        currentCode = toolOutput;
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

// extension.js
var envPath = import_path.default.resolve(__dirname, "../.env");
console.log(`Loading .env from: ${envPath}`);
import_dotenv2.default.config({ path: envPath });
console.log("GROQ_API_KEY loaded:", process.env.GROQ_API_KEY ? "Yes" : "No");
function activate(context) {
  console.log("Accessibility AI Agent extension is active!");
  let disposable = vscode.commands.registerCommand("extension.checkAccessibility", async () => {
    const editor = vscode.window.activeTextEditor;
    console.log("Active editor:", editor);
    if (!editor) {
      vscode.window.showInformationMessage("Please open a code file first.");
      return;
    }
    const originalCode = editor.document.getText();
    const languageId = editor.document.languageId;
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Improving accessibility with AI...",
        cancellable: false
      },
      async () => {
        try {
          console.log("Calling runAndMerge...");
          const improvedCode = await runAndMerge(originalCode);
          console.log("runAndMerge returned.");
          if (!improvedCode || improvedCode === originalCode) {
            vscode.window.showInformationMessage("No accessibility improvements suggested.");
            return;
          }
          const fullRange = new vscode.Range(
            editor.document.positionAt(0),
            editor.document.positionAt(originalCode.length)
          );
          await editor.edit((editBuilder) => {
            editBuilder.replace(fullRange, improvedCode);
          });
          vscode.window.showInformationMessage("Accessibility improvements applied!");
          console.log("Improved code displayed.");
        } catch (err) {
          vscode.window.showErrorMessage(`Error: ${err.message || err}`);
          console.error("Error during accessibility check:", err);
        }
      }
    );
  });
  context.subscriptions.push(disposable);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.cjs.map
