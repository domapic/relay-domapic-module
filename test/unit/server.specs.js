const path = require('path')

const test = require('narval')

const DomapicMocks = require('./Domapic.mocks')
const RelayHandlerMocks = require('./lib/RelayHandler.mocks')

test.describe('server', () => {
  let domapic
  let relayHandler

  test.before(() => {
    domapic = new DomapicMocks()
    relayHandler = new RelayHandlerMocks()
    require('../../server')
  })

  test.after(() => {
    domapic.restore()
    relayHandler.restore()
  })

  test.it('should have created a Domapic Module, passing the package path', () => {
    test.expect(domapic.stubs.createModule.getCall(0).args[0].packagePath).to.equal(path.resolve(__dirname, '..', '..'))
  })

  test.it('should have called to start the server', () => {
    test.expect(domapic.stubs.module.start).to.have.been.called()
  })
})
