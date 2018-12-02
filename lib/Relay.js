'use strict'

const libs = require('./libs')

const INITAL_GPIO_STATUS = {
  'true': 'high',
  'false': 'low'
}

const GPIO_STATUS = {
  'true': 1,
  'false': 0
}

class Relay {
  constructor (gpioNumber, initialStatus, invert) {
    this._gpioNumber = gpioNumber
    this._status = initialStatus

    const onoff = libs.onoff()
    if (!onoff.Gpio.accessible) {
      throw new Error('Gpio is not accesible')
    }

    this._relay = new onoff.Gpio(gpioNumber, INITAL_GPIO_STATUS[initialStatus.toString()], {
      activeLow: !!invert
    })

    this._offDeath = this._addDeathListener()
  }

  _addDeathListener () {
    return libs.death({uncaughtException: true})(() => {
      if (this._relay.unexport) {
        this._relay.unexport()
      }
      process.exit()
    })
  }

  _setStatus (status) {
    const gpioStatus = GPIO_STATUS[status.toString()]
    this._relay.writeSync(gpioStatus)
    this._status = status
    return status
  }

  _getStatus () {
    return !!this._relay.readSync()
  }

  set status (status) {
    this._setStatus(status)
  }

  get status () {
    return this._getStatus()
  }
}

module.exports = Relay
