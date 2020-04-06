/**
 * mysql数据库
 */
const mysql = require('knex')({
    debug: true,
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password:'root123',
      database: 'omoz'
    },
    acquireConnectionTimeout: 10000
  })

module.exports = {
    mysql
}