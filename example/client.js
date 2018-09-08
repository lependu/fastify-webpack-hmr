'use strict'

const message = require('./message')

let root = document.getElementById('root')
root.innerHTML = message

// Reloads client script on update
if (module.hot) {
  module.hot.accept()
}
