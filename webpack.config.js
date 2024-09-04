const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = (env) => {
  const isDevBuild = !(env && env.production);
  console.log("mode: ", isDevBuild ? "development" : "production");

  const sharedConfig = () => ({
    mode: isDevBuild ? "development" : "production",
    optimization: {
      minimize: !isDevBuild
    },
    stats: { modules: false },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: { 'react': path.join(__dirname, 'node_modules', 'react') }
    },
    output: {
      filename: (pathData) => {
        return (pathData.chunk.name === 'main-server' || pathData.chunk.name === 'main-client') ? '[name].js' : '[name].[contenthash].js';
      },
      publicPath: '/dist/' // Ensure assets are correctly referenced
    },
    devtool: isDevBuild ? 'inline-source-map' : 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        },
        {
          test: /\.jsx$/,
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name].[contenthash][ext]',
            publicPath: '/dist/assets/' // Correct public path for assets
          }
        },
        { test: /\.(jpe?g|gif|png)$/, type: 'asset/resource', generator: { filename: 'assets/[name].[contenthash][ext]' } },
        { test: /\.html$/, loader: "html-loader" },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: true // Enable processing URLs in CSS files
              }
            }
          ]
        },
        { test: /\.(pdf)$/, use: [{ loader: 'file-loader', options: {} }] }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "[name].[contenthash].css", chunkFilename: "[id].[contenthash].css" }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'node_modules/bootstrap-css-only/fonts', to: 'assets' } // Copy fonts to the correct directory
        ]
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isDevBuild ? 'development' : 'production')
      })
    ]
  });

  const clientBundleOutputDir = './wwwroot/dist';
  const clientBundleConfig = merge(sharedConfig(), {
    entry: { 'main-client': './ClientApp/boot-client.jsx' },
    output: { path: path.join(__dirname, clientBundleOutputDir) },
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./wwwroot/dist/vendor-manifest.json')
      })
    ].concat(isDevBuild ? [
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]')
      })
    ] : [])
  });

  const serverBundleConfig = merge(sharedConfig(), {
    target: 'node',
    externals: [nodeExternals()],
    resolve: { mainFields: ['main'] },
    entry: { 'main-server': './ClientApp/boot-server.jsx' },
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./ClientApp/dist/vendor-manifest.json'),
        sourceType: 'commonjs2',
        name: './vendor'
      })
    ],
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
      path: path.join(__dirname, './ClientApp/dist')
    },
    devtool: 'inline-source-map'
  });

  return [clientBundleConfig, serverBundleConfig];
};
