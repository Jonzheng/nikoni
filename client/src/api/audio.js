import { post } from '@/utils/axios'

export function publishAudio(data) {
  return post('/publishAudio', data)
}

export function queryAudio(data) {
  return post('/queryAudio', data)
}
