exports = module.exports = {
  log : async function(ctx, next) {
    const body = ctx.request.body
    console.log('-log-',new Date(),'-log-')
    console.log(body)
    
    console.log('==',new Date(),'==')
    await next()
  },
}