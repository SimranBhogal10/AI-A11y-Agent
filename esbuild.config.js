import * as esbuild from "esbuild";

esbuild.build({
  entryPoints: ["extension.js"], // main file
  bundle: true,
  platform: "node",
  target: "node16",
  outfile: "out/extension.cjs",
  format: "cjs", // VS Code requires CommonJS
  sourcemap: true,
  external: ["vscode"],
}).catch(() => process.exit(1));
