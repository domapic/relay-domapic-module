const test = require('narval')

const RelayHandlerMocks = require('./lib/RelayHandler.mocks')

test.describe('server', () => {
  let relayHandler
  let index

  test.before(() => {
    relayHandler = new RelayHandlerMocks()
    index = require('../../index')
  })

  test.after(() => {
    relayHandler.restore()
  })

  test.it('should return RelayHandler', () => {
    test.expect(index.RelayHandler).to.equal(relayHandler.stubs.Constructor)
  })
})
