const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
   const config = {
      splitChunks: {
      chunks: 'all'
      },
   };

   if (isProd) {
      config.minimizer = [
         new CssMinimizerPlugin(),
         new TerserPlugin(),
      ];
   }
   return config;
};

module.exports = {
   context: path.resolve(__dirname, 'src'),
   mode: 'development',
   entry: {
      main: './index.js',
      analytics: './analytics.js'
   },
   output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist')
   },
   resolve: {
      extensions: ['.js', '.json', '.png'],
      alias: {
         '@models': path.resolve(__dirname, 'src/models'),
         '@': path.resolve(__dirname, 'src'),
      }
   },
   optimization: optimization(),
   devServer: {
      port: 4200,
      hot: isDev,
      client: {overlay: true},
      static: {directory: path.join(__dirname)}
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: './index.html',
         minify: {
            collapseWhitespace: isProd
         }
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
         patterns: [
            { 
               from: path.resolve(__dirname, 'src/favicon.ico'),
               to: path.resolve(__dirname, 'dist') 
            }
         ]
      }),
      new MiniCssExtractPlugin({
         filename: '[name].[contenthash].css',
      })
   ],
   module: {
      rules: [
         {
            test: /\.css$/,
            use: [{
                  loader: MiniCssExtractPlugin.loader,
                  options: {},
               }, "css-loader",
            ]
         },
         {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
         },
         {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
         },
         {
            test: /\.xml$/,
            use: ['xml-loader']
         },
         {
            test: /\.csv$/,
            use: ['csv-loader']
         }
      ]
   }
};