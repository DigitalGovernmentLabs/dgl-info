const tsconfig = require("./tsconfig.json");
// eslint-disable-next-line import/order
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper,
};
