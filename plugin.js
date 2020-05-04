'use strict'

const fp = require('fastify-plugin')
const { join } = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

function fastifyWebpack (instance, opts, next) {
  if (instance.hasDecorator('webpack')) {
    return next(
      new Error('[fastify-weback-hmr]: fastify.webpack has registered already.')
    )
  }

  let { compiler, config, webpackDev = {}, webpackHot = {} } = opts

  if (!compiler) {
    if (typeof config !== 'object' && !Array.isArray(config)) {
      const path = config || join(__dirname, 'webpack.config.js')
      try {
        config = require(path)
      } catch (err) {
        return next(err)
      }
    }

    compiler = webpack(config)
  }

  if (!webpackDev.publicPath) {
    if (~Object.keys(compiler).indexOf('compilers')) {
      return next(new Error('[fastify-webpack-hmr]: You must specify webpackDev.publicPath option in multi compiler mode.'))
    }

    const { publicPath } = compiler.options.output

    if (!publicPath) {
      return next(new Error('[fastify-webpack-hmr]: publicPath must be set on `dev` options, or in a compiler\'s `output` configuration.'))
    }
    webpackDev.publicPath = publicPath
  }

  const dev = webpackDevMiddleware(compiler, webpackDev)
  instance.use(dev)

  let hot = null
  if (webpackHot) {
    hot = webpackHotMiddleware(compiler, webpackHot)
    instance.use(hot)
  }

  instance
    .decorate('webpack', {
      compiler,
      dev,
      hot
    })
    .addHook('onClose', (instance, next) => {
      instance.webpack.dev.close(() => next)
    })
  next()
}

module.exports = fp(fastifyWebpack, {
  fastify: '>=3.x',
  name: 'fastify-webpack'
})
