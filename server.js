'use strict'

const path = require('path')

const domapic = require('domapic-service')
const gpioOut = require('gpio-out-domapic')

const {
  GPIO,
  INITIAL_STATUS,
  INVERT,
  REMEMBER_LAST_STATUS,
  PRESS_TIME
} = require('./lib/statics')
const options = require('./lib/options')

const pluginConfigs = require('./lib/plugins')

domapic.createModule({
  packagePath: path.resolve(__dirname),
  customConfig: options
}).then(async dmpcModule => {
  const config = await dmpcModule.config.get()
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
        description: 'Switches on/off the relay',
        handler: async (newStatus) => {
          await relay.setStatus(newStatus)
          dmpcModule.events.emit('switch', newStatus)
          return newStatus
        }
      }
    },
    toggle: {
      description: 'Toggles the relay status',
      action: {
        description: 'Toggles the relay status',
        handler: async () => {
          const newStatus = await relay.toggle()
          dmpcModule.events.emit('switch', newStatus)
          return Promise.resolve()
        }
      }
    },
    shortPress: {
      description: 'Inverts the relay status during a defined period of time',
      action: {
        description: 'Inverts the relay status briefly',
        handler: async () => {
          const currentStatus = relay.status
          await relay.toggle()
          setTimeout(() => {
            relay.setStatus(currentStatus)
          }, config[PRESS_TIME])
          return Promise.resolve()
        }
      }
    }
  })
  await dmpcModule.addPluginConfig(pluginConfigs)
  await relay.init()
  return dmpcModule.start()
})
