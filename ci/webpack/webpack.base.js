/****************************
 * FilePath: webpack.base.js
 * 2019-12-15 13:34:54
 * Description:
 * 		 This file is the webpack conifg options
 * Copyright 2019-2021 Lamborui, All Rights Reserved.
 *
 */
const chalk = require('chalk')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const webpack = require('webpack')

// extract css to files
const autoprefixer = require('autoprefixer')

const { R, src, distTarget, pubDir } = require('../paths')

const { EjectPlugins } = require('./eject-env-plugins')

const {
  publicPath,
  Entries,
  htmlPlugins,
  ResolveAlias,
  ResolveExtensions,
} = require('./webpack-helper')

const devMode = process.env.NODE_ENV === 'development'
const JSParseRule = devMode
  ? {
      test: /\.(js)x?$/,
      exclude: /node_modules/,
      use: [
        {
          // hot refresh
          // see: https://github.com/facebook/react/issues/16604#issuecomment-528663101
          loader: require.resolve('babel-loader'),
          options: {
            plugins: [require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      ],
    }
  : {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader'],
    }

const PrevousPlugins = [
  ...EjectPlugins,
  // 进度条
  new ProgressBarPlugin({
    format: `:msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`,
  }),
  // handle node module use in browser ,mm/obs-store
  //   new webpack.ProvidePlugin({
  //     process: 'process/browser.js',
  //     Buffer: ['buffer', 'Buffer'],
  //   }),

  // Removes/cleans build folders and unused assets when rebuilding
  new CleanWebpackPlugin({
    dry: !devMode,
    verbose: !devMode,
  }),
]

const SuffixPlugins = []

const webpackPlugins = []
  .concat(PrevousPlugins)
  .concat(htmlPlugins)
  .concat(SuffixPlugins)

// Webpack Base
const webpackBaseConfig = {
  //   target: 'web',
  entry: {
    ...Entries,
  },
  output: {
    globalObject: 'this',
    path: distTarget,
    filename: (pathData) => {
      return pathData.chunk.name === 'background'
        ? '[name].bundle.js'
        : 'js/[name].bundle.js'
    },
    clean: true,
    publicPath: publicPath,
    assetModuleFilename: devMode
      ? 'images/[hash][ext][query]'
      : 'images/[name][ext]',
  },
  resolve: {
    alias: { ...ResolveAlias },
    extensions: ResolveExtensions,
    fallback: {
      // stream: require.resolve('stream-browserify'),
      //   ...fallback,
    },
  },
  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      JSParseRule,
      { test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/ },
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(css|scss|sass)$/,
        use: [
          // execute sort :down---> up
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'resolve-url-loader',
            options: { sourceMap: true, debug: true },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
              },
            },
          },
          {
            // postcss loader help for
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [autoprefixer],
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|)$/, type: 'asset/inline' },
    ],
  },
  plugins: webpackPlugins.filter(Boolean),
  stats: {
    errorDetails: true,
  },
}

module.exports = webpackBaseConfig
