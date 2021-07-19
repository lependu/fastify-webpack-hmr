'use strict'

const t = require('tap')
const { join } = require('path')
const { initServer } = require('./test-helper')

const WEBPACK_ENTRY = join(__dirname, '..', 'example', 'client.js')
const hotConfig = 'webpack-hot-middleware/client?path=__webpack_hmr'
const opts = {
  config: [
    {
      name: 'mobile',
      mode: 'development',
      entry: [WEBPACK_ENTRY, `${hotConfig}&name=mobile`],
      stats: false,
      output: { filename: 'mobile.js', publicPath: '/assets' },
      infrastructureLogging: { level: 'none' }
    },
    {
      name: 'desktop',
      mode: 'development',
      entry: [WEBPACK_ENTRY, `${hotConfig}&name=desktop`],
      stats: false,
      output: { filename: 'desktop.js', publicPath: '/assets' },
      infrastructureLogging: { level: 'none' }
    }
  ],
  webpackDev: {}
}

t.test('Throws if webpackDev.publicPath option not explicitly defined in multi compiler mode', t => {
  initServer(opts, (err, fastify) => {
    t.ok(err instanceof Error)
    t.match(err.message, /You must specify webpackDev.publicPath option in multi compiler mode./
    )
    fastify.close()
    t.end()
  })
})
