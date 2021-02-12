const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");

/** @type import('webpack').Configuration */
module.exports = {
  externals: [nodeExternals()],
  entry: {
    api: "./entrypoints/api/index.ts",
  },
  target: "node",
  node: {
    __dirname: false,
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader" }],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new NodemonPlugin({
      script: "./build/api.js",
      watch: ["./build/api.js", ".env", "yarn.lock"],
      delay: "1000",
    }),
  ],
  resolve: {
    extensions: [".js", ".ts"],
    plugins: [new TsconfigPathsPlugin()],
  },
};
