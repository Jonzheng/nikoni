const axios = require('axios')

const service = axios.create({
  timeout: 5000
})

// service.interceptors.request.use()

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

exports = module.exports = service
