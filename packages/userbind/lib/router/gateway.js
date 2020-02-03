const MS = require('jm-ms-core')
const error = require('jm-err')
const consts = require('consts')

const ms = new MS()

module.exports = function (service) {
  const router = ms.router()
  const { userBind, gateway } = service

  async function helpInfo (opts) {
    console.log(gateway)
    await gateway.bind('config')
    const doc = await gateway.get('/')
    doc.modules.config = await gateway.config.get('/')
    return doc
  }

  async function getBindUser (opts) {
    const { id } = opts.params
    if (!id) throw error.Err.FA_BADREQUEST
    const bindId = await userBind.getBindUser(id)
    return { id, bindId }
  }

  async function getBoundUser (opts) {
    const { id } = opts.params
    if (!id) throw error.Err.FA_BADREQUEST
    const bindId = await userBind.getBoundUser(id)
    return { id, bindId }
  }

  async function bindUser (opts) {
    const { params: { id }, data: { bindId } } = opts

    if (!id || !bindId) throw error.Err.FA_BADREQUEST

    // 判断是否已经绑定或者被绑定
    const [idInBind, bindIdInBind] = await Promise.all([
      userBind.isBind(id), userBind.isBind(bindId)
    ])
    if (idInBind || bindIdInBind) throw consts.Err.FA_USERBIND

    await userBind.bindUser(id, bindId)
    return { bindId }
  }

  async function unBindUser (opts) {
    const { id } = opts.params
    if (!id) throw error.Err.FA_BADREQUEST
    const bindId = await userBind.unBindUser(id)
    return { id, bindId }
  }

  router.add('/', 'get', helpInfo)

  router.add('/binds/:id', 'get', getBindUser)
  router.add('/bindeds/:id', 'get', getBoundUser)
  router.add('/binds/:id', 'put', bindUser)
  router.add('/binds/:id', 'delete', unBindUser)
  return router
}
