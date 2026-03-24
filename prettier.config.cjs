/** @type {import("prettier").Config} */
module.exports = {
  // Layout
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // Syntax style
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // Line endings
  endOfLine: 'lf',

  // File-type overrides
  overrides: [
    {
      files: ['*.json', '*.yml', '*.yaml'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'preserve',
      },
    },
  ],
};
