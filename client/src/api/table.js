import { post } from '@/utils/axios'

export function getList(data) {
  return post('/queryList', data)
}
