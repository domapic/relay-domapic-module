'use strict'

const Relay = require('./Relay')
const RelayMock = require('./RelayMock')

const { GPIO, INITIAL_STATUS, INVERT, booleanToLog } = require('./utils')

class RelayHandler {
  constructor (dpmcModule, options = {}) {
    this._module = dpmcModule
    this._gpioKey = options.gpioKey || GPIO
    this._initialStatusKey = options.initialStatusKey || INITIAL_STATUS
    this._invertKey = options.invertKey || INVERT
    this._defaultInitialStatus = options.initialStatus || false
    this.init = this.init.bind(this)
  }

  async init () {
    let initialStatus
    const gpioNumber = await this._module.config.get(this._gpioKey)
    const initialStatusConfig = await this._module.config.get(this._initialStatusKey) || this._defaultInitialStatus
    this._gpio = gpioNumber

    try {
      initialStatus = await this._module.storage.get(this._initialStatusKey)
    } catch (err) {
      initialStatus = initialStatusConfig
      await this._module.storage.set(this._initialStatusKey, initialStatus)
    }
    const invert = await this._module.config.get(this._invertKey)

    try {
      await this._module.tracer.info(`Initializing relay at Gpio ${gpioNumber}, initially ${booleanToLog(initialStatus)}, and invert option ${booleanToLog(invert)}`)
      this._relay = new Relay(gpioNumber, initialStatus, invert)
    } catch (error) {
      await this._module.tracer.error('Error initializing relay. Ensure that your system supports GPIOs programmatically', error)
      await this._module.tracer.info(`Inititalizing virtual relay, initially ${booleanToLog(initialStatus)}`)
      this._relay = new RelayMock(initialStatus)
    }
  }

  get status () {
    return this._relay.status
  }

  async setStatus (status) {
    await this._module.tracer.debug(`Setting relay at gpio ${this._gpio} to ${status}`)
    this._relay.status = status
    await this._module.storage.set(this._initialStatusKey, status)
    return status
  }

  async toggle () {
    const newStatus = !this._relay.status
    return this.setStatus(newStatus)
  }
}

module.exports = RelayHandler
