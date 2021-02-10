const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')

/** @type import('webpack').Configuration */
module.exports = {
  externals: [nodeExternals()],
  entry: {
    index: './entrypoints/index.ts'
  },
  target: 'node',
  node: {
    __dirname: false
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new NodemonPlugin({
      script: './build/index.js'
    })
  ],
  resolve: {
    extensions: ['.js', '.ts'],
    plugins: [new TsconfigPathsPlugin()]
  }
}
