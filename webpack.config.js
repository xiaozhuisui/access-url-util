const path = require("path");
module.exports = {
  entry: { index: "./src/index.ts" },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "lib"),
    clean: true,
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  // 用于source map进行调试
  devtool: "eval-source-map",
  mode: "development",
  watch: true,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  target: "node",
};
