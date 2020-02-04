const config = require('config')
const Validator = require('fastest-validator')
const error = require('jm-err')
const UserBind = require('./userbind')

const validator = new Validator()

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

  /**
   * 校验中间件
   * @param {object} schema 校验定义
   * @param {function} handler 函数
   * @returns {function} -
   */
  validatorMiddleware (schema, handler) {
    const check = validator.compile(schema)
    return function validateParams (opts) {
      const params = Object.assign(opts.params, opts.data)
      const res = check(params)
      if (res === true) {
        if (handler) {
          return handler(opts)
        }
      } else {
        throw error.err({ err: 422, msg: 'Parameter Validation Error', data: res })
      }
    }
  }
}
