'use strict'

const { test } = require('tap')
const { join } = require('path')
const Fastify = require('fastify')
const plugin = require('../dist/plugin')
const { register } = require('./helper')

const WEBPACK_ENTRY = join(__dirname, '..', 'example', 'client.js')

test('Decorates instance', t => {
  t.plan(4)

  const opts = {
    config: {
      mode: 'development',
      stats: false,
      entry: WEBPACK_ENTRY,
      output: { publicPath: '/assets', filename: 'main.js' }
    },
    webpackDev: { logLevel: 'silent' }
  }

  register(t, opts, (err, fastify) => {
    t.error(err)
    t.equal(typeof fastify.webpack.compiler, 'object')
    t.equal(typeof fastify.webpack.dev, 'function')
    t.equal(typeof fastify.webpack.hot, 'function')
  })
})

test('Decorates instance | webpackHot = false', t => {
  t.plan(4)

  const opts = {
    config: {
      mode: 'development',
      stats: false,
      entry: WEBPACK_ENTRY,
      output: { publicPath: '/assets', filename: 'main.js' }
    },
    webpackDev: { logLevel: 'silent' },
    webpackHot: false
  }

  register(t, opts, (err, fastify) => {
    t.error(err)
    t.equal(typeof fastify.webpack.compiler, 'object')
    t.equal(typeof fastify.webpack.dev, 'function')
    t.equal(fastify.webpack.hot, null)
  })
})

test('Throws if fastify.webpack has registered already', t => {
  t.plan(2)

  const fastify = Fastify()
  t.tearDown(() => fastify.close())

  const opts = {
    config: {
      mode: 'development',
      stats: false,
      entry: WEBPACK_ENTRY,
      output: { publicPath: '/assets', filename: 'main.js' }
    },
    webpackDev: { logLevel: 'silent' }
  }

  fastify
    .decorate('webpack', {})
    .register(plugin, opts)
    .ready(err => {
      t.ok(err instanceof Error)
      t.match(err.message, /fastify.webpack has registered already./)
    })
})

test('Throws if no configuration provided', t => {
  t.plan(2)

  const opts = {}

  register(t, opts, (err, fastify) => {
    t.ok(err instanceof Error)
    t.match(err.message, /Cannot find module/)
  })
})

test('Throws if config option is invalid', t => {
  t.plan(2)

  const opts = { config: 42 }

  register(t, opts, (err, fastify) => {
    t.ok(err instanceof Error)
    t.match(err.message, /must be string/g)
  })
})

test('Throws if no publicPath option provided', t => {
  t.plan(2)

  const opts = {
    config: {
      mode: 'development',
      entry: WEBPACK_ENTRY,
      stats: false,
      output: { filename: 'main.js' }
    }
  }

  register(t, opts, (err, fastify) => {
    t.ok(err instanceof Error)
    t.match(err.message, /publicPath must be set/)
  })
})

test('Sets webpackDev publicPath option from config.output.publicPath', t => {
  t.plan(2)

  const opts = {
    config: {
      mode: 'development',
      entry: WEBPACK_ENTRY,
      stats: false,
      output: { filename: 'main.js', publicPath: '/assets' }
    }
  }

  register(t, opts, (err, fastify) => {
    t.error(err)
    t.equal(fastify.webpack.dev.context.options.publicPath, '/assets')
  })
})

test('Respects webpackDev publicPath configuration if it is provided', t => {
  t.plan(2)

  const opts = {
    config: {
      mode: 'development',
      entry: WEBPACK_ENTRY,
      stats: false,
      output: { filename: 'main.js', publicPath: '/assets' }
    },
    webpackDev: { noInfo: true, publicPath: '/something-else' }
  }

  register(t, opts, (err, fastify) => {
    t.error(err)
    t.equal(fastify.webpack.dev.context.options.publicPath, '/something-else')
  })
})

test('Throws if webpackDev.publicPath option not explicitly defined in multi compiler mode', t => {
  t.plan(2)

  const hotConfig = 'webpack-hot-middleware/client?path=__webpack_hmr'
  const opts = {
    config: [
      {
        name: 'mobile',
        mode: 'development',
        entry: [WEBPACK_ENTRY, `${hotConfig}&name=mobile`],
        stats: false,
        output: { filename: 'mobile.js', publicPath: '/assets' }
      },
      {
        name: 'desktop',
        mode: 'development',
        entry: [WEBPACK_ENTRY, `${hotConfig}&name=desktop`],
        stats: false,
        output: { filename: 'desktop.js', publicPath: '/assets' }
      }
    ],
    webpackDev: { logLevel: 'silent' }
  }

  register(t, opts, (err, fastify) => {
    t.ok(err instanceof Error)
    t.match(
      err.message,
      /You must specify webpackDev.publicPath option in multi compiler mode./
    )
  })
})
