import request from '../utils/request'

// 获取音乐url
export const songUrl = (params) => {
  return request({
    method: 'get',
    url: '/song/url',
    params,
  })
}
// 获取我的喜欢音乐
export const playlist = (params) => {
  return request({
    method: 'get',
    url: 'playlist/detail?id=6858720456',
    params,
  })
}

// 获取歌词
export const lyric = (params) => {
  return request({
    method: 'get',
    url: 'lyric',
    params,
  })
}