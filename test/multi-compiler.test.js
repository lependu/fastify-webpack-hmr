'use strict'

const t = require('tap')
const { join } = require('path')
const { buildServer, testRequest } = require('./test-helper')

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
  webpackDev: { publicPath: '/assets' }
}

t.test('Multiple compiler', t => {
  buildServer(t, opts, port => {
    testRequest(t, port, 'assets/mobile.js', /javascript/, () => {
      testRequest(t, port, 'assets/desktop.js', /javascript/, () =>
        t.end()
      )
    })
  })
})
