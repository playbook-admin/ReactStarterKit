const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

module.exports = (env) => {
  const isDevBuild = !(env && env.production);

  const sharedConfig = {
    mode: isDevBuild ? "development" : "production",
    optimization: {
      minimize: !isDevBuild
    },
    stats: { modules: false },
    resolve: { extensions: ['.js'] },
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg|jpe?g|gif|png)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name].[contenthash][ext]',
            publicPath: '/dist/' // Ensure correct public path
          }
        }
      ]
    },
    entry: {
      vendor: [
        './wwwroot/Site.css',
        './wwwroot/DragAndDrop.css',
        'bootstrap/dist/css/bootstrap.min.css',
        'bootstrap-css-only/css/bootstrap.css',
        '@fortawesome/fontawesome-free/css/all.min.css'
      ]
    },
    output: {
      publicPath: '/dist/',
      filename: '[name].js',
      library: '[name]_[fullhash]'
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "vendor.css"
      }),
      new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve('node-noop')),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isDevBuild ? 'development' : 'production')
      })
    ]
  };

  const clientBundleConfig = merge(sharedConfig, {
    output: { path: path.join(__dirname, 'wwwroot', 'dist') },
    module: {
      rules: [
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "vendor.css"
      }),
      new webpack.DllPlugin({
        path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
        name: '[name]_[fullhash]'
      })
    ]
  });

  const serverBundleConfig = merge(sharedConfig, {
    target: 'node',
    externals: [nodeExternals()],
    resolve: { mainFields: ['main'] },
    output: {
      path: path.join(__dirname, 'ClientApp', 'dist'),
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] }
      ]
    },
    entry: { vendor: ['aspnet-prerendering', 'react-dom/server'] },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new webpack.DllPlugin({
        path: path.join(__dirname, 'ClientApp', 'dist', '[name]-manifest.json'),
        name: '[name]_[fullhash]'
      })
    ]
  });

  return [clientBundleConfig, serverBundleConfig];
};
