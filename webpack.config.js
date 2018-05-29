const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  target: 'node',
  context: path.join(__dirname, 'src'),
  entry: './module.ts',
  devtool: "source-map",
  output: {
    filename: 'module.js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'amd'
  },
  externals: [
    'lodash', 'moment',
    function(context, request, callback) {
      var prefix = 'app/';
      if (request.indexOf(prefix) === 0) {
        return callback(null, request);
      }
      callback();
    }
  ],
  plugins: [
    new CleanWebpackPlugin('dist', { allowExternal: true }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([
      { from: 'plugin.json', to: '.' },
      { from: '../README.md', to: '.' },
      { from: '../LICENSE', to: '.' },
      { from: 'partials/*', to: '.' },
      { from: 'img/*', to: '.' },
      { from: 'query_help.md', to: '.'},
    ]),
  ],
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: "babel-loader",
            options: { presets: ['env'] }
          },
          "ts-loader"
        ],
        // include: "/node_modules/grafana-sdk-mocks/app/headers/common.d.ts",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          },
        ]
      }
    ]
  }
}