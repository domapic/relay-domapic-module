'use strict'

const path = require('path')

const domapic = require('domapic-service')

const RelayHandler = require('./lib/RelayHandler')
const options = require('./lib/options')

domapic.createModule({
  packagePath: path.resolve(__dirname),
  customConfig: options
}).then(async dmpcModule => {
  const relay = new RelayHandler(dmpcModule)

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
  try {
    await relay.init()
  } catch (error) {
    dmpcModule.tracer.error(error)
  }
  return dmpcModule.start()
})
