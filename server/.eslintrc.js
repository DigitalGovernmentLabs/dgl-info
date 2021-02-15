module.exports = {
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: { project: "./server/tsconfig.json" },
    },
  ],
};
