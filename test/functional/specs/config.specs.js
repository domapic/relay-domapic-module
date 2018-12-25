const test = require('narval')

const utils = require('./utils')

test.describe('module configuration', function () {
  this.timeout(10000)
  let connection

  test.before(() => {
    connection = new utils.Connection()
  })

  test.it('should be exposed in config api', () => {
    return connection.request('/config', {
      method: 'GET'
    }).then(response => {
      return Promise.all([
        test.expect(response.statusCode).to.equal(200),
        test.expect(response.body.initialStatus).to.equal(true),
        test.expect(response.body.gpio).to.equal(54),
        test.expect(response.body.invert).to.equal(true),
        test.expect(response.body.pressTime).to.equal(2000)
      ])
    })
  })

  test.describe('initialStatus option', () => {
    test.it('should set initial relay status', () => {
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
})
