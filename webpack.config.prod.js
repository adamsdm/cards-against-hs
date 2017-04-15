var webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    host:   ['./src/host/index.js'],
    client: ['./src/client/index.js']
  },
  output: {
    path: require("path").resolve("./dist"),
    filename: '[name]-bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      minimize: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true, 
        warnings: false
      },
      comments: false
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
}
