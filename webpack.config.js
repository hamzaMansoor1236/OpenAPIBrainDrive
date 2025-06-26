const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = {
  mode: "development",
  entry: "./src/main",
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: "auto",
    clean: true,
    library: {
      type: 'var',
      name: 'OpenApiBrainDrive'
    }
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "OpenApiBrainDrive",
      library: { type: "var", name: "OpenApiBrainDrive" },
      filename: "remoteEntry.js",
      exposes: {
        "./ComponentNetworkStatus": "./src/ComponentNetworkStatus",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
          eager: true
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
          eager: true
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    port: 9006,
    static: {
      directory: path.join(__dirname, "public"),
    },
    hot: true,
  },
};