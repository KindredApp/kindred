const path = require('path');

const config = {
  devtool: 'source-map',
  entry: path.join(__dirname, './client/index.jsx'),
	
  output: {
    path: path.join(__dirname, 'bundles'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
				
        query: {
          presets: ['env', 'react']
        }
      }
    ]
  }
};

module.exports = config;