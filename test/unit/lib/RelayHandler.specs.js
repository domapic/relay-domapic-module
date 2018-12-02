const test = require('narval')

const DomapicMocks = require('../Domapic.mocks')
const RelayMocks = require('./Relay.mocks')
const RelayMockMocks = require('./RelayMock.mocks')

test.describe('Relay', () => {
  let RelayHandler
  let relayHandler
  let domapicMocks
  let relayMocks
  let relayMockMocks

  test.beforeEach(() => {
    relayMocks = new RelayMocks()
    relayMockMocks = new RelayMockMocks()
    domapicMocks = new DomapicMocks()
    RelayHandler = require('../../../lib/RelayHandler')
  })

  test.afterEach(() => {
    domapicMocks.restore()
    relayMocks.restore()
    relayMockMocks.restore()
  })

  test.it('should set initial status key as "initialStatus" if option is not received', () => {
    relayHandler = new RelayHandler(domapicMocks.stubs.module)
    test.expect(relayHandler._initialStatusKey).to.equal('initialStatus')
  })

  test.it('should set gpio key as "gpio" if option is not received', () => {
    relayHandler = new RelayHandler(domapicMocks.stubs.module)
    test.expect(relayHandler._gpioKey).to.equal('gpio')
  })

  test.it('should set invert key as "invertKey" if option is not received', () => {
    relayHandler = new RelayHandler(domapicMocks.stubs.module)
    test.expect(relayHandler._invertKey).to.equal('invert')
  })

  test.it('should set default initial status as false if option is not received', () => {
    relayHandler = new RelayHandler(domapicMocks.stubs.module)
    test.expect(relayHandler._defaultInitialStatus).to.equal(false)
  })

  test.describe('init method', () => {
    test.beforeEach(() => {
      domapicMocks.stubs.module.storage.get.resolves(true)
      domapicMocks.stubs.module.config.get.resolves(true)
    })

    test.describe('when creating new relay', async () => {
      test.it('should set the initial status from storage, using the key defined in options', async () => {
        const fooStatus = false
        domapicMocks.stubs.module.storage.get.resolves(fooStatus)
        const initialStatusKey = 'fooStatusKey'
        relayHandler = new RelayHandler(domapicMocks.stubs.module, {
          initialStatusKey
        })
        await relayHandler.init()
        test.expect(domapicMocks.stubs.module.storage.get).to.have.been.calledWith(initialStatusKey)
        test.expect(relayMocks.stubs.Constructor.getCall(0).args[1]).to.equal(fooStatus)
      })

      test.it('should set the initial status from config if storage throws an error', async () => {
        const fooStatus = false
        domapicMocks.stubs.module.storage.get.rejects(new Error())
        domapicMocks.stubs.module.config.get.resolves(fooStatus)
        relayHandler = new RelayHandler(domapicMocks.stubs.module)
        await relayHandler.init()
        test.expect(relayMocks.stubs.Constructor.getCall(0).args[1]).to.equal(fooStatus)
      })

      test.it('should set the relay number from config, getting it from defined gpioKey', async () => {
        const fooGpio = 15
        const gpioKey = 'fooGpioKey'
        domapicMocks.stubs.module.config.get.resolves(fooGpio)
        relayHandler = new RelayHandler(domapicMocks.stubs.module, {
          gpioKey
        })
        await relayHandler.init()
        test.expect(domapicMocks.stubs.module.config.get).to.have.been.calledWith(gpioKey)
        test.expect(relayMocks.stubs.Constructor.getCall(0).args[0]).to.equal(fooGpio)
      })

      test.it('should set the invert option from config, getting it from defined invertKey', async () => {
        const fooInvert = false
        const invertKey = 'fooInvertKey'
        domapicMocks.stubs.module.config.get.resolves(fooInvert)
        relayHandler = new RelayHandler(domapicMocks.stubs.module, {
          invertKey
        })
        await relayHandler.init()
        test.expect(domapicMocks.stubs.module.config.get).to.have.been.calledWith(invertKey)
        test.expect(relayMocks.stubs.Constructor.getCall(0).args[2]).to.equal(fooInvert)
      })

      test.it('should init a virtual relay passing the status if real relay initialization throws an error', async () => {
        const fooStatus = false
        domapicMocks.stubs.module.storage.get.resolves(fooStatus)
        relayMocks.stubs.Constructor.throws(new Error())
        relayHandler = new RelayHandler(domapicMocks.stubs.module)
        await relayHandler.init()
        test.expect(relayMockMocks.stubs.Constructor.getCall(0).args[0]).to.equal(fooStatus)
      })
    })
  })

  test.describe('status methods', () => {
    test.beforeEach(async () => {
      domapicMocks.stubs.module.storage.get.resolves(true)
      domapicMocks.stubs.module.config.get.resolves(true)
      relayHandler = new RelayHandler(domapicMocks.stubs.module)
      await relayHandler.init()
    })

    test.describe('status getter', () => {
      test.it('should return current relay status', async () => {
        const fooStatus = 'foo-status'
        relayMocks.stubs.instance.status = fooStatus
        test.expect(relayHandler.status).to.equal(fooStatus)
      })
    })

    test.describe('setStatus method', () => {
      test.it('should set relay status', async () => {
        const fooStatus = 'foo-status'
        await relayHandler.setStatus(fooStatus)
        test.expect(relayMocks.stubs.instance.status).to.equal(fooStatus)
      })

      test.it('should save status to storage', async () => {
        const fooStatus = 'foo-status'
        await relayHandler.setStatus(fooStatus)
        test.expect(domapicMocks.stubs.module.storage.set.getCall(0).args[1]).to.equal(fooStatus)
      })
    })

    test.describe('toggle method', () => {
      test.it('should set relay status to true if current status is false', async () => {
        relayMocks.stubs.instance.status = false
        await relayHandler.toggle()
        test.expect(relayMocks.stubs.instance.status).to.equal(true)
      })

      test.it('should set relay status to false if current status is true', async () => {
        relayMocks.stubs.instance.status = true
        await relayHandler.toggle()
        test.expect(relayMocks.stubs.instance.status).to.equal(false)
      })
    })
  })
})
