import request from '@/utils/request'
// import qs from 'qs';

export function queryList(data) {
  return request({
    url: '/api/queryList',
    method: 'post',
    // headers: {'Content-Type':'application/json; charset=utf-8'},
    data
  })
}

export function postList(data) {
  // let postData = qs.stringify({
  //   key1:'value1',
  //   key2:'value2',
  //   key3:'value3',
  // });
  // console.log(postData)

  return request({
    url: '/api/queryList',
    method: 'post',
    // headers: {'Content-Type':'application/x-www-form-urlencoded'},
    // headers: {'Content-Type':'text/plain'},
    data: data
  })
}