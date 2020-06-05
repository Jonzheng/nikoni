module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: false,
    node: false,
    es6: false,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    "no-const-assign": 2,//禁止修改const声明的变量
    "no-dupe-args": 2,//函数参数不能重复
    "no-console": 0,//禁止使用console
  }
}
