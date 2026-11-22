// babel.config.cjs  (project root)
// Only Jest uses this. Vite ignores it and keeps building the app as before.
// Needs @babel/preset-env and @babel/preset-react (dev dependencies; confirm with instructor).
module.exports = {
  presets: [
    // Turn import/export into something Jest (Node) can run.
    ["@babel/preset-env", { targets: { node: "current" } }],
    // Turn JSX into function calls. "automatic" means you don't need `import React`.
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
