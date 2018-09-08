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

## Configuration options

For a complete exampe please check out the `example` directory and the `test.js` file.  
The plugin accepts a configuration object, with a following properties:

### compiler
`{object}` `optional`

If you pass a custom `webpack compiler` instance to the plugin, it will pass that to the middlewares.

<details>
  <summary><strong>Example</strong></summary>
  
  ```js
  const fastify = require('fastify')()
  const HMR = require('fastify-webpack-hmr')
  const webpack = require('webpack')
  const webpackConfig = require('path/to/your/webpack/config')
  
  const compiler = webpack(webpackConfig)
  
  fastify.register(HMR, { compiler })
  
  fastify.listen(3000)
  ```
</details>

### config
`{string|object}` `optional`

For the detailed configuration options please check the [`webpack documentation`](https://webpack.js.org/configuration/).   
If config is a `string` it has to be a path to a valid webpack configuration file.
<details>
  <summary><strong>Example</strong></summary>

  ```js
  const fastify = require('fastify')()
  const HMR = require('fastify-webpack-hmr')
  const { join } = require('path')
  
  const config = join(__dirname, 'path.to.your.webpack.config')
  
  fastify.register(HMR, { config })
  
  fastify.listen(3000)
  ```
</details>

Or you can directly pass a valid webpack configuration `object`.

<details>
  <summary><strong>Example</strong></summary>
  
  ```js
  const fastify = require('fastify')()
  const HMR = require('fastify-webpack-hmr')
  const { join } = require('path')
  
  const config = {
    mode: 'development', // Prevents webpack warning
    entry: join(__dirname, 'path.to.your.client.file'),
    output: {
      publicPath: '/assets',
      filename: 'main.js'
    }
  }
  
  fastify.register(HMR, { config })
  
  fastify.listen(3000)
  ```
</details>

### webpackDev
`{object}` `optional`

Additional configuration options which will be passed to [`webpack-dev-middleware`](https://github.com/webpack/webpack-dev-middleware#options).

### webpackHot
`{object}` `optional`

Additional configuration options which will be passed to [`webpack-hot-middleware`](https://github.com/webpack-contrib/webpack-hot-middleware#config).

## License
Licensed under [MIT](./LICENSE).
