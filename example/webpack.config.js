const { join } = require('path')
const webpack = require('webpack')
const hotConf = 'webpack-hot-middleware/client?path=/__webpack_hmr'

module.exports = {
  entry: {
    main: [join(__dirname, 'client.js'), hotConf]
  },
  stats: false,
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  output: {
    publicPath: '/assets',
    path: join(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
