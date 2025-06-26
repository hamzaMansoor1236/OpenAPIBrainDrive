const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = {
  mode: "development",
  entry: "./src/main",
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "auto",
    clean: true,
    library: {
      type: 'var',
      name: 'OpenAPIBrainDrive'
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
          'css-loader'
        ]
      }
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "OpenAPIBrainDrive",
      library: { type: "var", name: "OpenAPIBrainDrive" },
      filename: "remoteEntry.js",
      exposes: {
        "./OpenAPIBrainDrive": "./src/main",
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
      template: "./index.html",
    }),
  ],
  devServer: {
    port: 3001,
    static: {
      directory: path.join(__dirname, "public"),
    },
    hot: true,
  },
};