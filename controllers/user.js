// middlewares
let Formvalidate = require('../middlewares/formvalidate')
let session = require('../middlewares/session')
// models
let userModel = require('../models/user')

/**
 * 登陆
 */
exports.login = async ctx => {
  let postData = ctx.reqbody
  // 检验
  let ret = Formvalidate([{
    value: postData.account,
    type: ['notNull'],
    code: ['16']
  }, {
    value: postData.password,
    type: ['notNull'],
    code: ['16']
  }])
  if (typeof ret === 'object') {
    ctx.resbody = ret
    return
  }
  ctx.filter(postData)

  // model
  userModel.login(ctx)
}

/**
 * 注册
 */
exports.register = async ctx => {

}

/**
 * 修改资料
 */
exports.put = async ctx => {

}

/**
 * 查看会员
 */
exports.getVip = async ctx => {

}

/**
 * 解冻/冻结vip
 */
exports.putVip = async ctx => {

}

/**
 * 升级为vip
 */
exports.postVip = async ctx => {

}