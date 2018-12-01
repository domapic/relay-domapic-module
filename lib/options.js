'use strict'

const { GPIO, INITIAL_STATUS, INVERT } = require('./utils')

module.exports = {
  [INITIAL_STATUS]: {
    type: 'boolean',
    alias: ['status'],
    describe: 'Set initial status of the relay when module is started',
    default: false
  },
  [GPIO]: {
    type: 'number',
    describe: 'GPIO number where the relay is connected',
    default: 2
  },
  [INVERT]: {
    type: 'boolean',
    alias: ['invert'],
    describe: 'Values read from or written to the GPIO should be inverted',
    default: false
  }
}
