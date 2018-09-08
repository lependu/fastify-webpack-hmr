'use strict'

const fp = require('fastify-plugin')
const { join } = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

function fastifyWebpack (instance, opts, next) {
  let { compiler, config, webpackDev = {}, webpackHot = {} } = opts

  if (!compiler) {
    if (typeof config !== 'object') {
      let path = config || join(__dirname, 'webpack.config.js')
      try {
        config = require(path)
      } catch (err) {
        return next(new Error(
          '[fastify-webpack-hmr]: configuration is missing.'
        ))
      }
    }

    compiler = webpack(config)
  }

  if (!webpackDev.publicPath) {
    let { publicPath } = compiler.options.output

    if (!publicPath) {
      return next(new Error('[fastify-webpack-hmr]: publicPath must be set on `dev` options, or in a compiler\'s `output` configuration.'))
    }
    webpackDev.publicPath = publicPath
  }

  const devWare = webpackDevMiddleware(compiler, webpackDev)
  const hotWare = webpackHotMiddleware(compiler, webpackHot)

  instance
    .decorate('webpackCompiler', compiler)
    .decorate('webpackDev', devWare)
    .decorate('webpackHot', hotWare)
    .use(devWare)
    .use(hotWare)
    .addHook('onClose', (instance, next) => {
      instance.webpackDev.close(() => next)
    })
  next()
}

module.exports = fp(fastifyWebpack, {
  fastify: '>=1.x',
  name: 'fastify-webpack'
})
