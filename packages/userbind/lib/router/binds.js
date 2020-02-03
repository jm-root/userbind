const MS = require('jm-ms-core')
const error = require('jm-err')
const consts = require('consts')

const ms = new MS()

module.exports = function (service) {
  let router = ms.router()
  const { redis } = service

  async function bindUser (opts) {
    const { params: { id }, data: { bindId } } = opts

    if (!id || !bindId) throw error.Err.FA_BADREQUEST

    const [idInBind, bindIdInBind] = await Promise.all([
      redis.get(id), redis.get(bindId)
    ])

    if (idInBind || bindIdInBind) throw consts.Err.FA_USERBIND

    await Promise.all([
      redis.setnx(id, bindId),
      redis.setnx(bindId, id)
    ])
    return { bindId }
  }

  router.add('/:id', 'put', bindUser)
  return router
}
