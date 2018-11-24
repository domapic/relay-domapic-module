const path = require('path')

const test = require('narval')

const domapic = require('domapic-service')

test.describe('server', () => {
  let sandbox
  let start

  test.before(() => {
    sandbox = test.sinon.createSandbox()
    start = sandbox.stub()
    sandbox.stub(domapic, 'createModule').resolves({
      start
    })
    require('../../server')
  })

  test.after(() => {
    sandbox.restore()
  })

  test.it('should have created a Domapic Module, passing the package path', () => {
    test.expect(domapic.createModule).to.have.been.calledWith({
      packagePath: path.resolve(__dirname, '..', '..')
    })
  })

  test.it('should have called to start the server', () => {
    test.expect(start).to.have.been.called()
  })
})
