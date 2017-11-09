const path = require('path');
var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devServer: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    disableHostCheck: true
  },
  entry: './app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('dev')
      }
    }),

    new UglifyJSPlugin(), //minify everything
    new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
      { from: './app/dmtools.html', to: "dmtools.html" }
    ]),
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
