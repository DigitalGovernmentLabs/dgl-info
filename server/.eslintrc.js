const path = require("path");

module.exports = {
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: { project: path.join(__dirname, "tsconfig.json") },
    },
  ],
};
