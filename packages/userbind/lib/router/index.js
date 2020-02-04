const MS = require('jm-ms-core')
const error = require('jm-err')
const consts = require('consts')

const ms = new MS()

module.exports = function (service) {
  const router = ms.router()
  const { userBind, validatorMiddleware } = service

  async function getBindUser (opts) {
    const { id } = opts.params
    const bindId = await userBind.getBindUser(id)
    return { id, bindId }
  }

  async function getBoundUser (opts) {
    const { id: bindId } = opts.params
    const id = await userBind.getBoundUser(bindId)
    return { id, bindId }
  }

  async function bindUser (opts) {
    const { params: { id }, data: { bindId } } = opts

    if (id === bindId) throw error.err(error.Err.FA_BADREQUEST)

    // 判断是否已经绑定或者被绑定
    const [idInBind, bindIdInBind] = await Promise.all([
      userBind.isBind(id), userBind.isBind(bindId)
    ])
    if (idInBind || bindIdInBind) throw error.err(consts.Err.FA_USERBIND)

    await userBind.bindUser(id, bindId)
    return { bindId }
  }

  async function unBindUser (opts) {
    const { id } = opts.params
    const bindId = await userBind.unBindUser(id)
    return { id, bindId }
  }

  router.add('/binds/:id', 'get', validatorMiddleware({
    id: { type: 'string', min: 1, max: 500, optional: false }
  }, getBindUser))

  router.add('/bindeds/:id', 'get', validatorMiddleware({
    id: { type: 'string', min: 1, max: 500, optional: false }
  }, getBoundUser))

  router.add('/binds/:id', 'put', validatorMiddleware({
    id: { type: 'string', min: 1, max: 500, optional: false },
    bindId: { type: 'string', min: 1, max: 500, optional: false }
  }, bindUser))

  router.add('/binds/:id', 'delete', validatorMiddleware({
    id: { type: 'string', min: 1, max: 500, optional: false }
  }, unBindUser))
  return router
}
