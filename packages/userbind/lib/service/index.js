const Redis = require('ioredis')
const config = require('config')

module.exports = class extends require('service') {
  constructor (opts = {}) {
    super(opts)
    this.emit('ready')
    this.redis = new Redis(config.redis)
    this.redis.on('error', err => console.error(err))
    this.redis.on('connect', () => console.log('redis db connect'))
    this.redis.on('ready', () => console.log('redis db ready'))
  }

  router (opts) {
    const dir = require('path').join(__dirname, '../router')
    return new (require('router'))(this, { dir, ...opts }).router
  }
}
