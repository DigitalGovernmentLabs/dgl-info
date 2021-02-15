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
    complexity: ["error", 8],
    "max-depth": ["error", 3],
    "max-nested-callbacks": ["error", 2],
    "max-lines": ["error", 200],
    // code の max-len は prettier にまかせる。
    "max-len": [
      "error",
      {
        comments: 80,
        ignoreUrls: true,
      },
    ],
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
