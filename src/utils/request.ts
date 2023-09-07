import axios from 'axios'
import { message } from 'antd'
import { getToken, removeToken } from './auth'

const service = axios.create({
    baseURL: process.env.NODE_ENV === 'production'?'/aps-web':'/api',
    timeout: 120000, // 单位毫秒
})

// 添加请求拦截器
service.interceptors.request.use((config) => {
  config.headers['x-token'] = getToken()
  return config
  }, (err: any) => {
    console.log('err', err)
   // 对请求错误做些什么
   return Promise.reject(err)
})

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
  }, function (error: { message: string; }) {
    // 则先判断本地是否有token，有则从本地删除token，并且跳转到登录页面
    message.error('请求服务器失败:'+error.message)
    // if (getToken()) {
    //   // 移除本地的token
    //   removeToken()
    //   window.location.reload() // 重新刷新页面
    // }
    return Promise.reject(error)
  })
export default service