'use strict'

class RelayMock {
  constructor (initialStatus) {
    this._status = initialStatus
  }

  set status (status) {
    this._status = status
    return this._status
  }

  get status () {
    return this._status
  }
}

module.exports = RelayMock
