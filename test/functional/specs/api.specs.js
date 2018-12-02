const test = require('narval')

const utils = require('./utils')

test.describe('switch api', function () {
  this.timeout(10000)
  let connection

  test.before(() => {
    connection = new utils.Connection()
  })

  test.describe('switch action', () => {
    test.it('should return relay status', () => {
      return connection.request('/abilities/switch/action', {
        method: 'POST',
        body: {
          data: true
        }
      }).then(response => {
        return Promise.all([
          test.expect(response.statusCode).to.equal(200),
          test.expect(response.body).to.deep.equal({
            data: true
          })
        ])
      })
    })

    test.it('should have saved status to storage', () => {
      return utils.readStorage()
        .then(storage => {
          test.expect(storage.initialStatus).to.equal(true)
        })
    })

    test.it('should have changed status', () => {
      return connection.request('/abilities/switch/state', {
        method: 'GET'
      }).then(response => {
        return Promise.all([
          test.expect(response.statusCode).to.equal(200),
          test.expect(response.body).to.deep.equal({
            data: true
          })
        ])
      })
    })
  })

  test.describe('toggle action', () => {
    test.it('should not return relay status', () => {
      return connection.request('/abilities/toggle/action', {
        method: 'POST'
      }).then(response => {
        return Promise.all([
          test.expect(response.statusCode).to.equal(200),
          test.expect(response.body).to.be.undefined()
        ])
      })
    })

    test.it('should have saved status to storage', () => {
      return utils.readStorage()
        .then(storage => {
          test.expect(storage.initialStatus).to.equal(false)
        })
    })

    test.it('should have changed status', () => {
      return connection.request('/abilities/switch/state', {
        method: 'GET'
      }).then(response => {
        return Promise.all([
          test.expect(response.statusCode).to.equal(200),
          test.expect(response.body).to.deep.equal({
            data: false
          })
        ])
      })
    })
  })
})
