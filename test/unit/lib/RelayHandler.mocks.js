const test = require('narval')

const mockery = require('../mockery')

const MODULE = './lib/RelayHandler'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const instanceStubs = {
    init: sandbox.stub().resolves(),
    setStatus: sandbox.stub().resolves(),
    toggle: sandbox.stub().resolves()
  }

  const stub = sandbox.stub().callsFake(function () {
    return instanceStubs
  })

  const restore = () => {
    sandbox.restore()
    mockery.deregister(MODULE)
  }

  mockery.register(MODULE, stub)

  return {
    restore,
    stubs: {
      Constructor: stub,
      instance: instanceStubs
    }
  }
}

module.exports = Mock
