import fp from 'fastify-plugin'
import { join } from 'path'
import webpack from 'webpack'
import fastify from 'fastify'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

export interface Options {
  compiler?: webpack.Compiler | webpack.MultiCompiler
  config?: string | webpack.Configuration | webpack.Configuration[]
  webpackDev?: webpackDevMiddleware.Options
  webpackHot?: false | webpackHotMiddleware.Options
}

function fastifyWebpack(instance: fastify.FastifyInstance, opts: Options, next: (err?: fastify.FastifyError) => void) {
  if (instance.hasDecorator('webpack')) {
    return next(
      new Error('[fastify-weback-hmr]: fastify.webpack has registered already.')
    )
  }

  let compiler: webpack.Compiler | webpack.MultiCompiler

  if (opts.compiler === undefined) {
    let conf: webpack.Configuration | webpack.Configuration[]
    if (typeof opts.config !== 'object' && !Array.isArray(opts.config)) {
      const path = opts.config || join(__dirname, 'webpack.config.js')
      try {
        conf = require(path)
      } catch (err) {
        return next(err)
      }
    } else {
      conf = opts.config
    }

    if (Array.isArray(conf)) {
      compiler = webpack(conf)
    } else {
      compiler = webpack(conf)
    }
  } else {
    compiler = opts.compiler
  }

  if (!opts.webpackDev?.publicPath) {
    if (compiler instanceof webpack.MultiCompiler) {
      return next(new Error('[fastify-webpack-hmr]: You must specify webpackDev.publicPath option in multi compiler mode.'))
    }

    const publicPath = compiler.options.output?.publicPath

    if (!publicPath) {
      return next(new Error('[fastify-webpack-hmr]: publicPath must be set on `dev` options, or in a compiler\'s `output` configuration.'))
    }

    if (opts.webpackDev === undefined) {
      opts.webpackDev = { publicPath }
    } else {
      opts.webpackDev.publicPath = publicPath
    }
  }

  const dev = webpackDevMiddleware(compiler, opts.webpackDev)
  instance.use(dev)

  let hot: null | ReturnType<typeof webpackHotMiddleware> = null
  if (opts.webpackHot !== false) {
    hot = webpackHotMiddleware(compiler, opts.webpackHot)
    instance.use(hot)
  }

  instance
    .decorate('webpack', {
      compiler,
      dev,
      hot
    })
    .addHook('onClose', (instance, next) => {
      // @ts-ignore
      instance.webpack.dev.close(() => next)
    })
  next()
}

module.exports = fp(fastifyWebpack, {
  fastify: '>=2.x',
  name: 'fastify-webpack'
})
