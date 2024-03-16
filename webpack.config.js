const path = require("path");
module.exports = {
  entry: { route: "./src/route/index.ts", config: "./src/config/index.ts" },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "lib"),
    clean: true,
    library: "accessUrlUtils",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 用于source map进行调试
  devtool: "eval-source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  target: "node",
};
