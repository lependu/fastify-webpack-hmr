'use strict'

const plugin = require('../plugin')
const fastify = require('fastify')()
const { join } = require('path')

fastify
  // Loads config from ./webpack.congif.js
  .register(plugin, { config: join(__dirname, 'webpack.config.js') })
  // You might use the fastify-static plugin and/or some template
  // engine to serve a more complex html file.
  .get('/', (request, reply) => {
    reply
      .type('text/html; charset=utf-8')
      .send(`
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8'/>
    <title>Fastify webpack hot example</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
  </head>
  <body>
    <!-- CLIENT SCRIPT ROOT PLACEHOLDER -->
    <div id='root'></div>
    <!-- LOADS WEBPACK COMPILED ASSET [publicPath]/[filename] -->
    <script src='/assets/main.js'></script>
  </body>
</html>`)
  })

fastify.listen(3000)
