const path = require('path')
const webpack = require('webpack')
const config = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader:'babel-loader',
        query: {presets:["es2015"]}
      }
    ]
  }
}
module.exports = config
