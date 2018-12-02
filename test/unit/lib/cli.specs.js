const path = require('path')

const test = require('narval')

const DomapicMocks = require('../Domapic.mocks')
const options = require('../../../lib/options')

test.describe('cli', () => {
  const packagePath = path.resolve(__dirname, '..', '..', '..')
  let domapic

  test.before(() => {
    domapic = new DomapicMocks()
    require('../../../lib/cli')
  })

  test.after(() => {
    domapic.restore()
  })

  test.it('should have created a Domapic cli', () => {
    test.expect(domapic.stubs.cli).to.have.been.called()
  })

  test.it('should have passed the package path to the cli', () => {
    test.expect(domapic.stubs.cli.getCall(0).args[0].packagePath).to.equal(packagePath)
  })

  test.it('should have passed the server path to the cli', () => {
    test.expect(domapic.stubs.cli.getCall(0).args[0].script).to.equal(path.resolve(packagePath, 'server.js'))
  })

  test.it('should have passed the options to the cli', () => {
    test.expect(domapic.stubs.cli.getCall(0).args[0].customConfig).to.equal(options)
  })
})
