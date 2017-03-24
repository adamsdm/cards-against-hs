var webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './public/js/client.js',
    './public/js/host.js'
  ],
  output: {
    path: require("path").resolve("./dist"),
    filename: '[name]-bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'react-hmre']
        }
      }
    ]
  }
}
