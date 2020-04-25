/**
 * 响应处理模块
 */
module.exports = async (ctx, next) => {
  try {
    const body = ctx.request.body
    console.log('---request:', new Date())
    console.log(ctx.request)
    console.log('--body:')
    console.log(body)
    console.log('===',new Date(),'===')
    await next()
  } catch (e) {
    console.log('Catch Error: %o', e)
    ctx.status = 200
    // 输出详细的错误信息
    ctx.body = {
      code: -1,
      error: e && e.message ? e.message : e.toString()
    }
  }
}