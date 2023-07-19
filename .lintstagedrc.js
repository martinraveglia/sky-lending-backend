module.exports = {
  // Type check TypeScript files
  "**/*.(ts|tsx)": () => "yarn tsc --noEmit",

  // Lint & Prettify TS and JS files
  "**/*.(ts|tsx|js)": (filenames) => [
    `jest --passWithNoTests --findRelatedTests ${filenames.join(" ")}`,
    `yarn eslint ${filenames.join(" ")} --fix`,
    `yarn prettier --write ${filenames.join(" ")}`,
    `git add ${filenames.join(" ")}`,
  ],

  // Prettify only Markdown and JSON files
  "**/*.(md|json)": (filenames) =>
    `yarn prettier --write ${filenames.join(" ")}`,
};
