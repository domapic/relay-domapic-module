const path = require('path')

const test = require('narval')

const DomapicMocks = require('./Domapic.mocks')
const GpioMocks = require('./Gpio.mocks')

test.describe('server', () => {
  let domapic
  let gpio
  let abilities

  test.before(async () => {
    domapic = new DomapicMocks()
    domapic.stubs.module.config.get.resolves({
      pressTime: 500
    })
    gpio = new GpioMocks()
    require('../../server')
    await domapic.utils.resolveOnStartCalled()
    abilities = domapic.stubs.module.register.getCall(0).args[0]
  })

  test.after(() => {
    domapic.restore()
    gpio.restore()
  })

  test.it('should have created a Domapic Module, passing the package path', () => {
    test.expect(domapic.stubs.createModule.getCall(0).args[0].packagePath).to.equal(path.resolve(__dirname, '..', '..'))
  })

  test.it('should have called to start the server', () => {
    test.expect(domapic.stubs.module.start).to.have.been.called()
  })

  test.describe('when domapic module is returned', () => {
    test.it('should have created a new gpio', () => {
      test.expect(gpio.stubs.Constructor).to.have.been.calledWith(domapic.stubs.module)
    })

    test.it('should have registered abilities', () => {
      abilities = domapic.stubs.module.register.getCall(0).args[0]
      test.expect(domapic.stubs.module.register).to.have.been.called()
    })
  })

  test.describe('switch state handler', () => {
    test.it('should return relay status', () => {
      const fooData = 'foo-status'
      gpio.stubs.instance.status = fooData
      test.expect(abilities.switch.state.handler()).to.equal(fooData)
    })
  })

  test.describe('switch action handler', () => {
    test.it('should set relay status', async () => {
      const fooData = 'foo-action'
      await abilities.switch.action.handler(fooData)
      test.expect(gpio.stubs.instance.setStatus).to.have.been.calledWith(fooData)
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
      test.expect(gpio.stubs.instance.toggle).to.have.been.called()
    })

    test.it('should emit a switch event passing the new status data', async () => {
      const fooData = 'foo-status'
      gpio.stubs.instance.toggle.resolves(fooData)
      await abilities.toggle.action.handler()
      test.expect(domapic.stubs.module.events.emit).to.have.been.calledWith('switch', fooData)
    })

    test.it('should not return data', async () => {
      const result = await abilities.toggle.action.handler()
      test.expect(result).to.be.undefined()
    })
  })

  test.describe('shortPress action handler', () => {
    test.before(() => {
      gpio.stubs.instance.toggle.reset()
      gpio.stubs.instance.setStatus.reset()
    })

    test.it('should call to toggle relay, and revert it again', done => {
      gpio.stubs.instance.status = true
      abilities.shortPress.action.handler().then(() => {
        test.expect(gpio.stubs.instance.toggle).to.have.been.called()
        setTimeout(() => {
          test.expect(gpio.stubs.instance.setStatus).to.have.been.calledWith(true)
          done()
        }, 600)
      })
    })

    test.it('should not call to toggle relay more than once simultaneously', done => {
      gpio.stubs.instance.status = true
      gpio.stubs.instance.toggle.reset()
      gpio.stubs.instance.setStatus.reset()

      abilities.shortPress.action.handler()
      abilities.shortPress.action.handler()
      abilities.shortPress.action.handler()
      setTimeout(() => {
        test.expect(gpio.stubs.instance.toggle).to.have.been.calledOnce()
        test.expect(gpio.stubs.instance.setStatus).to.have.been.calledWith(true)
        done()
      }, 600)
    })
  })
})
