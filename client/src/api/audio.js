import { post } from '@/utils/axios'

export function publishAudio(data) {
  return post('/publishAudio', data)
}
