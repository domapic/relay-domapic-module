const test = require('narval')

const mockery = require('./mockery')

const MODULE = 'domapic-service'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const moduleStubs = {
    start: sandbox.stub(),
    register: sandbox.stub()
  }

  const stubs = {
    createModule: sandbox.stub().resolves(moduleStubs)
  }

  const restore = () => {
    sandbox.restore()
    mockery.deregister(MODULE)
  }

  mockery.register(MODULE, stubs)

  return {
    restore,
    stubs: {
      ...stubs,
      module: moduleStubs
    }
  }
}

module.exports = Mock
