'use strict'

const {
  GPIO,
  INITIAL_STATUS,
  INVERT,
  REMEMBER_LAST_STATUS,
  PRESS_TIME
} = require('./statics')

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
  },
  [REMEMBER_LAST_STATUS]: {
    type: 'boolean',
    alias: ['rememberStatus'],
    describe: 'Gpio will remember last status when restarted',
    default: false
  },
  [PRESS_TIME]: {
    type: 'number',
    describe: 'Time in miliseconds that relay will be activated when short-press action is executed',
    default: 2000
  }
}
