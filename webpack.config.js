const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const loader = require('sass-loader');

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

const filename = ext => isDev ? `[name].${ext}`: `[name].[hash].${ext}`;

const cssLoaders = extra => {
   const loaders = [
      {
         loader: MiniCssExtractPlugin.loader,
         options: {},
      }, 
      "css-loader"
   ];
   if (extra) {
      loaders.push(extra);
   }
   return loaders;
};

const babelOptions = preset => {
   const opts = {
      presets: [
         '@babel/preset-env',
      ]
   };
   if (preset) {
      opts.presets.push(preset);
   }
   return opts;
};

module.exports = {
   context: path.resolve(__dirname, 'src'),
   mode: 'development',
   entry: {
      main: ['@babel/polyfill', './js/index.js'],
   },
   output: {
      filename: filename('js'),
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
   devtool: isDev ? 'source-map' : false,
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
         filename: filename('css'),
      })
   ],
   module: {
      rules: [
         {
            test: /\.html$/,
            loader: "html-loader",
         },
         {
            test: /\.css$/,
            use: cssLoaders(),
         },
         {
            test: /\.less$/,
            use: cssLoaders("less-loader"),
         },
         {
            test: /\.s[ac]ss$/,
            use: cssLoaders("sass-loader"),
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
         },
         {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
               options: babelOptions(),
            }
         },
         {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
               options: babelOptions('@babel/preset-typescript'),
            }
         },
         {
            test: /\.jsx$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
               options: babelOptions('@babel/preset-react'),
            }
         }
      ]
   }
};