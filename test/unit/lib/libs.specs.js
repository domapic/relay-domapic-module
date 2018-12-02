const death = require('death')
const test = require('narval')

const OnoffMocks = require('./Onoff.mocks')

test.describe('server', () => {
  let onoff
  let libs

  test.before(() => {
    onoff = new OnoffMocks()
    libs = require('../../../lib/libs')
  })

  test.after(() => {
    onoff.restore()
  })

  test.it('should return death', () => {
    test.expect(libs.death).to.equal(death)
  })

  test.describe('onoff method', () => {
    test.it('should return onoff library', () => {
      test.expect(libs.onoff()).to.equal(onoff.stubs)
    })
  })
})
