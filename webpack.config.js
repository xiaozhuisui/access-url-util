const path = require("path");
module.exports = {
  entry: { index: "./src/main.ts" },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "lib"),
    clean: true,
    library:'bsI18nAccessUtils',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  // 用于source map进行调试
  devtool: "eval-source-map",
  mode: "development",
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
