const path = require('path')

const test = require('narval')

const DomapicMocks = require('./Domapic.mocks')
const RelayHandlerMocks = require('./lib/RelayHandler.mocks')

test.describe('server', () => {
  let domapic
  let relayHandler
  let abilities

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

  test.describe('when domapic module is returned', () => {
    test.before(() => {
      return domapic.utils.resolveOnStartCalled()
    })

    test.it('should have created a new RelayHandler', () => {
      test.expect(relayHandler.stubs.Constructor).to.have.been.calledWith(domapic.stubs.module)
    })

    test.it('should have registered abilities', () => {
      abilities = domapic.stubs.module.register.getCall(0).args[0]
      test.expect(domapic.stubs.module.register).to.have.been.called()
    })
  })

  test.describe('switch state handler', () => {
    test.it('should return relay status', () => {
      const fooData = 'foo-status'
      relayHandler.stubs.instance.status = fooData
      test.expect(abilities.switch.state.handler()).to.equal(fooData)
    })
  })

  test.describe('switch action handler', () => {
    test.it('should set relay status', async () => {
      const fooData = 'foo-action'
      await abilities.switch.action.handler(fooData)
      test.expect(relayHandler.stubs.instance.setStatus).to.have.been.calledWith(fooData)
    })

    test.it('should emit a switch event passing the action data', async () => {
      const fooData = 'foo-action-2'
      await abilities.switch.action.handler(fooData)
      test.expect(domapic.stubs.module.events.emit).to.have.been.calledWith('switch', fooData)
    })

    test.it('should return action data', async () => {
      const fooData = 'foo-action-3'
      const result = await abilities.switch.action.handler(fooData)
      test.expect(result).to.equal(fooData)
    })
  })

  test.describe('switch toggle handler', () => {
    test.it('should call to toggle relay', async () => {
      await abilities.toggle.action.handler()
      test.expect(relayHandler.stubs.instance.toggle).to.have.been.called()
    })

    test.it('should emit a switch event passing the new status data', async () => {
      const fooData = 'foo-status'
      relayHandler.stubs.instance.toggle.resolves(fooData)
      await abilities.toggle.action.handler()
      test.expect(domapic.stubs.module.events.emit).to.have.been.calledWith('switch', fooData)
    })

    test.it('should not return data', async () => {
      const result = await abilities.toggle.action.handler()
      test.expect(result).to.be.undefined()
    })
  })
})
