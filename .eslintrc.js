module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "prettier",
    "prettier/vue",
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended",
  ],
  plugins: ["prettier"],
  rules: {
    complexity: ["error", 4],
    "max-depth": ["error", 1],
    "max-nested-callbacks": ["error", 2],
    "max-lines": ["error", 200],
    "no-console": "error",
    "prefer-template": "error",
    "no-void": ["error", { allowAsStatement: true }],
  },
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: { project: "./tsconfig.json" },
      rules: {
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-unsafe-return": "error",
        "@typescript-eslint/no-unnecessary-condition": [
          "error",
          {
            allowConstantLoopConditions: true,
          },
        ],
        "@typescript-eslint/no-implicit-any-catch": "error",
      },
    },
  ],
};
