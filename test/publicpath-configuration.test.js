'use strict'

const t = require('tap')
const { join } = require('path')
const { initServer } = require('./test-helper')

const WEBPACK_ENTRY = join(__dirname, '..', 'example', 'client.js')
const opts = {
  config: {
    mode: 'development',
    entry: WEBPACK_ENTRY,
    stats: false,
    output: { filename: 'main.js', publicPath: '/assets' },
    infrastructureLogging: { level: 'none' }
  },
  webpackDev: { publicPath: '/something-else' }
}

t.test(
  'Respects webpackDev publicPath configuration if it is provided', t => {
    initServer(opts, (err, fastify) => {
      t.error(err)
      t.equal(fastify.webpack.dev.context.options.publicPath,
        '/something-else')
      fastify.close()
      t.end()
    })
  })
