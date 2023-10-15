const webpack = require("webpack");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");


const BUILD_DIR = path.resolve(__dirname, "dist");
const APP_DIR = path.resolve(__dirname, "src");





module.exports = env => {
  const { NODE_ENV } = env || {};
  const environment = NODE_ENV || "";
  console.log("Running In Environment:", environment,APP_DIR + "/index.tsx");

  return {
    entry: APP_DIR + "/index.js",
    output: {
      path: BUILD_DIR,
      filename: "js/main.[contenthash:6].js",
      publicPath: "/",
      assetModuleFilename: "images/[hash][ext][query]"
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)?$/,
          use: [{
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
              onlyCompileBundledFiles: true
            }
          }],
          exclude: /node_modules/
        },
        {
            test: /\.(js|jsx)$/,
            loader: "babel-loader",
            options: {
                presets: [
                    "@babel/preset-react",
                    "@babel/preset-env"
                ]
            },
        },
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: { esModule: false }
            }
          ]
        },
        {
          test: /\.(woff(2)?|otf|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/"
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          type: "asset",
          exclude: /node_modules/

        },
        {
          test: /\.mp3$/,
          type: "asset",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      alias: {
        "~context": path.resolve(__dirname, "src/context/"),
        "~components": path.resolve(__dirname, "src/components/"),
        "~utils": path.resolve(__dirname, "src/utils/"),
        "~pages": path.resolve(__dirname, "src/pages/"),
        "~services": path.resolve(__dirname, "src/services/"),
        "~state": path.resolve(__dirname, "src/state/")
      },
      fallback: {
        "fs": false,
        process: 'process/browser',
        buffer: require.resolve('buffer/'),
        assert: require.resolve("assert"),
        crypto: require.resolve("crypto-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        stream: require.resolve("stream-browserify")
      },
      extensions: [".tsx", ".ts", ".js", ".json", ".jsx"]
    },
    plugins: [
      new HtmlWebPackPlugin({
        inject: true,
          template: "public/index.html",
          filename: "index.html",
          // chunksSortMode: 'none',
          // favicon: "./assets/logo_fg.svg"
      }),
      // new MiniCssExtractPlugin({
      //     filename: "[name].[contenthash:6].css",
      //     chunkFilename: "[id].[contenthash:6].css",
      // }),
      new CopyPlugin({
          patterns: [
              {from: "config", to: "config"},
          ],
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|cn/),
      new webpack.DefinePlugin({
          "process.env": {
              ENV: JSON.stringify(NODE_ENV)
          },
      }),
    ],
    devServer: {
      historyApiFallback: true,
      hot: true
    }
  };
};
