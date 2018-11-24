const path = require('path')
const domapic = require('domapic-service')

domapic.createModule({ packagePath: path.resolve(__dirname) })
  .then(async module => {
    return module.start()
  })
