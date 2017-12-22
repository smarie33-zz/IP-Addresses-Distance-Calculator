var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
  entry: APP_DIR + '/index.jsx',
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader',
        query:{
          presets:['es2015', 'stage-0','react']
        }
      }
    ]
  },
  output: {
    path: BUILD_DIR,
    publicPath: 'build',
    filename: 'bundle.js'
  }
};

module.exports = config;