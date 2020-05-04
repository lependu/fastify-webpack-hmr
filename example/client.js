'use strict'

const message = require('./message')

const root = document.getElementById('root')
root.innerHTML = message

// Reloads client script on update
if (module.hot) {
  module.hot.accept()
}
