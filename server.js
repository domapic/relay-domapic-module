'use strict'

const path = require('path')

const domapic = require('domapic-service')
const gpioOut = require('gpio-out-domapic')

const { GPIO, INITIAL_STATUS, INVERT, REMEMBER_LAST_STATUS } = require('./lib/statics')
const options = require('./lib/options')

const pluginConfigs = require('./lib/plugins')

domapic.createModule({
  packagePath: path.resolve(__dirname),
  customConfig: options
}).then(async dmpcModule => {
  const relay = new gpioOut.Gpio(dmpcModule, {}, {
    gpio: GPIO,
    initialStatus: INITIAL_STATUS,
    invert: INVERT,
    rememberLastStatus: REMEMBER_LAST_STATUS
  })

  await dmpcModule.register({
    switch: {
      description: 'Handle the relay status',
      data: {
        type: 'boolean'
      },
      event: {
        description: 'The relay status has changed'
      },
      state: {
        description: 'Current relay status',
        handler: () => relay.status
      },
      action: {
        description: 'Switch on/off the relay',
        handler: async (newStatus) => {
          await relay.setStatus(newStatus)
          dmpcModule.events.emit('switch', newStatus)
          return newStatus
        }
      }
    },
    toggle: {
      description: 'Toggle the relay status',
      action: {
        description: 'Toggle the relay status',
        handler: async () => {
          const newStatus = await relay.toggle()
          dmpcModule.events.emit('switch', newStatus)
          return Promise.resolve()
        }
      }
    }
  })
  await dmpcModule.addPluginConfig(pluginConfigs)
  await relay.init()
  return dmpcModule.start()
})
