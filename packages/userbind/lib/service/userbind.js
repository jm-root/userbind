const Redis = require('ioredis')

class UserBind {
  constructor (db) {
    this.redis = new Redis(db)
    this.prefix = 'userbind'
    this.redis.on('error', err => console.error(err))
    this.redis.on('connect', () => console.log('redis db connect'))
    this.redis.on('ready', () => console.log('redis db ready'))
  }

  /**
   * @description 获取绑定者redis的key
   * @param {string} id 绑定者id
   * @returns {string} redis的key
   */
  getBindKey (id) {
    return `${this.prefix}:${id}`
  }

  /**
   * @description 获取被绑定者redis的key
   * @param {string} id 绑定者id
   * @returns {string} redis的key
   */
  getBoundKey (id) {
    return `${this.prefix}:bound:bindId`
  }

  /**
   * @description 获取绑定者信息
   * @param {string} id 用户ID
   * @returns
   * @memberof UserBind
   */
  getBindUser (id) {
    const key = this.getBindKey(id)
    return this.redis.get(key)
  }

  /**
   * @description 获取绑定者信息
   * @param {string} id 被绑定用户ID
   * @returns
   * @memberof UserBind
   */
  getBoundUser (id) {
    const key = this.getBoundKey(id)
    return this.redis.get(key)
  }

  /**
   * @description 判断是否已经绑定或者被绑定
   * @param {string} id 用户ID
   * @returns {boolean}
   * @memberof UserBind
   */
  async isBind (id) {
    const [bindKey, boundKey] = [
      this.getBindKey(id), this.getBoundKey(id)
    ]
    const [idInBind, bindIdInBind] = await Promise.all([
      this.redis.exists(bindKey), this.redis.exists(boundKey)
    ])
    return idInBind || bindIdInBind
  }

  /**
   * @description 绑定用户
   * @param {string} id 绑定者ID
   * @param {string} bindId 被绑定者ID
   * @returns {boolean}
   * @memberof UserBind
   */
  async bindUser (id, bindId) {
    const [bindKey, boundKey] = [ this.getBindKey(id), this.getBoundKey(bindId) ]
    await Promise.all([
      this.redis.set(bindKey, bindId),
      this.redis.set(boundKey, id)
    ])
    return true
  }

  /**
   * @description 解绑用户
   * @param {sting} id 用户ID
   * @returns {string} bindId 被绑定者ID
   * @memberof UserBind
   */
  async unBindUser (id) {
    const bindKey = this.getBindKey(id)
    const bindId = await this.redis.get(bindKey)
    const boundKey = this.getBoundKey(bindId)

    await Promise.all([bindKey, boundKey].map(el => this.redis.del(el)))
    return bindId
  }
}

module.exports = UserBind
