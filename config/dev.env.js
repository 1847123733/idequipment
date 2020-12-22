'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  BASE_API: '"http://192.168.1.156:8080"'      // 本地访问
})

// mock使用
// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"'
// })

// easymock使用
// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"',
//   ENV_CONFIG: '"dev"',
//   BASE_API: '"https://www.easy-mock.com/mock/5b349d61d6fb0438a6be7ea3"'
// })
