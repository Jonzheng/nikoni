import { get, post } from '@/utils/axios'
import qs from 'qs';

export function queryList(data) {
  const dd = qs.stringify(data)
  console.log(dd)
  const jd = JSON.parse('{"level": "ssr"}')
  console.log(jd)
  // return request({
  //   url: '/queryList',
  //   method: 'post',
  //   data: data
  // })
  return post('/queryList', data)
}

export function postList(data) {
  // let postData = qs.stringify({
  //   key1:'value1',
  //   key2:'value2',
  //   key3:'value3',
  // });
  // console.log(postData)

  // return request({
  //   url: '/api/queryList',
  //   method: 'post',
  //   // headers: {'Content-Type':'application/x-www-form-urlencoded'},
  //   // headers: {'Content-Type':'text/plain'},
  //   data: data
  // })
}
