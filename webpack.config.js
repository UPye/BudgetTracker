const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
    entry: {
      app: './public/js/index.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: `${__dirname}/dist`
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                esModule: false,
                name(file) {
                  return '[path][name].[ext]';
                },
                publicPath(url) {
                  return url.replace('../', '/icons/');
                }
              }
            },
            {
              loader: 'image-webpack-loader'
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static'
      }),
      new WebpackPwaManifest({
        name: "Budget_Tracker",
        short_name: "BudgetTracker",
        description: "An app that allows you to keep track of your budget.",
        start_url: '../index.html',
        background_color: '#01579b',
        theme_color: '#ffffff',
        fingerprints: false,
        inject: false,
        icons: [
          {
            src: path.resolve('public/icons'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons')
          }
        ]
      })
    ],
    mode: 'development'
  };
  
  module.exports = config;