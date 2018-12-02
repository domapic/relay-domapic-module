const test = require('narval')

const RelayMock = require('../../../lib/RelayMock')

test.describe('Relay Mock', () => {
  test.it('should set the initial status', () => {
    const fooStatus = true
    const relayMock = new RelayMock(fooStatus)
    test.expect(relayMock.status).to.equal(fooStatus)
  })

  test.it('should set the status', () => {
    const fooStatus = true
    const fooNewStatus = false
    const relayMock = new RelayMock(fooStatus)
    relayMock.status = fooNewStatus
    test.expect(relayMock.status).to.equal(fooNewStatus)
  })
})
