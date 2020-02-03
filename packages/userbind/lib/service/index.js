const config = require('config')
const UserBind = require('./userbind')

module.exports = class extends require('service') {
  constructor (opts = {}) {
    super(opts)
    this.emit('ready')
    this.userBind = new UserBind(config.redis)
  }

  router (opts) {
    const dir = require('path').join(__dirname, '../router')
    return new (require('router'))(this, { dir, ...opts }).router
  }
}
