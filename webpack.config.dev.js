var webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    host:   ['webpack-hot-middleware/client', './src/host/index.js'],
    client: ['webpack-hot-middleware/client', './src/client/index.js']
  },
  output: {
    path: require("path").resolve("./dist"),
    filename: '[name]-bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
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
      },
      {
          test: /\.scss/,
          loader: 'style-loader!css-loader!sass-loader',
      }
    ]
  }
}
