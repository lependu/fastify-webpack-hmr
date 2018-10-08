'use strict'

const { test } = require('tap')
const { join } = require('path')
const webpack = require('webpack')
const { testHMR } = require('./helper')

const WEBPACK_ENTRY = join(__dirname, '..', 'example', 'client.js')
const WEBPACK_CONFIG = join(__dirname, '..', 'example', 'webpack.config.js')

test('Works with custom compiler', t => {
  t.plan(7)
  const opts = {
    mode: 'development',
    entry: WEBPACK_ENTRY,
    output: { publicPath: '/assets', filename: 'main.js' }
  }
  const compiler = webpack(opts)
  const webpackDev = { logLevel: 'silent' }

  testHMR(t, { compiler, webpackDev }, 'assets/main.js')
})

test('Works with config option | string', t => {
  t.plan(7)
  const opts = {
    config: WEBPACK_CONFIG,
    webpackDev: { logLevel: 'silent' }
  }

  testHMR(t, opts, 'assets/main.js')
})

test('Works with config option | object', t => {
  t.plan(7)
  const opts = {
    config: {
      mode: 'development',
      stats: false,
      entry: WEBPACK_ENTRY,
      output: { publicPath: '/assets', filename: 'main.js' }
    },
    webpackDev: { logLevel: 'silent' }
  }

  testHMR(t, opts, 'assets/main.js')
})

test('Works with multiple entries', t => {
  t.plan(14)

  const hotConf = 'webpack-hot-middleware/client?path=/__webpack_hmr'
  const opts = {
    config: {
      mode: 'development',
      stats: false,
      entry: {
        first: [WEBPACK_ENTRY, hotConf],
        second: [WEBPACK_ENTRY, hotConf]
      },
      output: { publicPath: '/assets', filename: '[name].js' }
    },
    webpackDev: { logLevel: 'silent' }
  }

  testHMR(t, opts, 'assets/first.js')
  testHMR(t, opts, 'assets/second.js')
})

test('Works with multi compiler config', t => {
  t.plan(14)

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
    webpackDev: { logLevel: 'silent', publicPath: '/assets' }
  }

  testHMR(t, opts, 'assets/mobile.js')
  testHMR(t, opts, 'assets/desktop.js')
})
