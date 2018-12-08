const test = require('narval')

const utils = require('./utils')

test.describe('switch api', function () {
  this.timeout(10000)
  let connection

  test.before(() => {
    connection = new utils.Connection()
  })

  test.describe('switch state', () => {
    test.it('should return initial relay status, not last relay status before restart', () => {
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
