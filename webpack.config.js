var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'client/public');
var APP_DIR = path.resolve(__dirname, 'client/src');

var config = {
  devtool: '#inline-source-map',
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader',
        query:
        {
          presets: ['react']
        }
      },
      {
        test: /\.css?/,
        include: APP_DIR,
        loader: 'style-loader!css-loader'
      }
    ]
  }

};

module.exports = config;