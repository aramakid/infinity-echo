var webpack = require('webpack');

module.exports = {
  entry: {
    bundle: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: "./public/js",
    publicPath: "/js"
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
     compress: {
       warnings: false
     }
    })
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015']
      },
      exclude: /node_modules/,
      include: __dirname
    }]
  },
  devServer: {
    contentBase: './public',
    port: 3001,
    hot: true,
    inline: true,
    historyApiFallback: true
  }
};
