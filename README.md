# fastify-webpack-hmr

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/lependu/fastify-webpack-hmr.svg?branch=master)](https://travis-ci.org/lependu/fastify-webpack-hmr)
[![Greenkeeper badge](https://badges.greenkeeper.io/lependu/fastify-webpack-hmr.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/lependu/fastify-webpack-hmr/badge.svg)](https://snyk.io/test/github/lependu/fastify-webpack-hmr)
[![Coverage Status](https://coveralls.io/repos/github/lependu/fastify-webpack-hmr/badge.svg?branch=master)](https://coveralls.io/github/lependu/fastify-webpack-hmr?branch=master)
![npm](https://img.shields.io/npm/dm/fastify-webpack-hmr.svg)
![npm](https://img.shields.io/npm/v/fastify-webpack-hmr.svg)

Inspired by [koa-webpack](https://github.com/shellscape/koa-webpack) plugin.  
Under the hood it sets up [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) and [webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware).

## Install
```
$ npm i --save-dev fastify-webpack-hmr
```

## Usage

For a more detailed exampe please check out the `example` directory.  
The plugin accepts a configuration object, with a following properties:

### compiler
`{object}` `optional`

If you pass a custom `webpack compiler` instance to the plugin, it will pass that to the middlewares.  
*Note:* if you pass a `compiler` option the plugin omits the `config` option.
```js
const fastify = require('fastify')()
const HMR = require('fastify-webpack-hmr')
const webpack = require('webpack')
const webpackConfig = require('path/to/your/webpack/config')

const compiler = webpack(webpackConfig)

fastify.register(HMR, { compiler })

fastify.listen(3000)
```

### config
`{string|object}` `optional`

If you pass this option instead of a `compiler`, the plugin tries to set up the webpack compiler and will pass that compiler instance to the middlewares. For the detailed configuration options please check the [`webpack documentation`](https://webpack.js.org/configuration/).  

If config is a `string` it has to be a path to a valid webpack configuration file.
```js
const fastify = require('fastify')()
const HMR = require('fastify-webpack-hmr')
const { join } = require('path')

const config = join(__dirname, 'path.to.your.webpack.config')

fastify.register(HMR, { config })

fastify.listen(3000)
  ```
  
Or you can directly pass a valid webpack configuration `object`.
```js
const fastify = require('fastify')()
const HMR = require('fastify-webpack-hmr')
const { join } = require('path')
const hotConf = 'webpack-hot-middleware/client?path=/__webpack_hmr'

const config = {
  mode: 'development', // Prevents webpack warning
  // Add the webpack-hot-middleware to the entry point array.
  entry: [join(__dirname, 'path.to.your.client.file'), hotConf],
  output: {
    publicPath: '/assets',
    filename: 'main.js'
  }
}

fastify.register(HMR, { config })

fastify.listen(3000)
```

### webpackDev
`{object}` `optional`

Additional configuration options which will be passed to [`webpack-dev-middleware`](https://github.com/webpack/webpack-dev-middleware#options).

### webpackHot
`{object}` `optional`

Additional configuration options which will be passed to [`webpack-hot-middleware`](https://github.com/webpack-contrib/webpack-hot-middleware#config).

## Reference
This plugin decorates the `fastify` instance with `webpack` object. The object has the following properties:
- `compiler` The [`webpack compiler` instance](https://webpack.js.org/api/node/).
- `dev` The [`webpack-dev-middleware` instance](https://github.com/webpack/webpack-dev-middleware#api).
- `hot` The [`webpack-hot-middleware` instance](https://github.com/webpack-contrib/webpack-hot-middleware).

## License
Licensed under [MIT](./LICENSE).
