import axios from 'axios'
import { message } from 'antd'
import { getToken, removeToken } from './auth'
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { setOperationTime } from './timeOut'

const service = axios.create({
    baseURL: process.env.NODE_ENV === 'production'?'/aps-web':'/api',
    timeout: 1000 * 60 * 5 , // 单位毫秒
})

NProgress.configure({ showSpinner: false }); // 显示右上角螺旋加载提示

// 添加请求拦截器
service.interceptors.request.use((config) => {
    config.headers['x-token'] = getToken()
    NProgress.start()
    // 存入浏览器最后一次操作时间
    setOperationTime()
    return config
  }, (err: any) => {
    console.log('err', err)
    // 对请求错误做些什么
    NProgress.done()
    return Promise.reject(err)
})

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    NProgress.done()
    return response.data;
  }, function (error: any) {
    // 如果是4xx系列的请求，则是授权失败弹出对应提示
    switch (error?.response?.status) {
    case 401:
      message.error('请求服务器失败:'+error.response.data.message)
      break
    case 502:
      message.error('请求服务器失败:'+error.message)
      break
    case 500:
      message.error('请求服务器失败:'+error.message)
      NProgress.done()
      return Promise.reject(error)
    default:
      message.error('请求服务器失败')
    }
    // 则先判断本地是否有token，有则从本地删除token，并且跳转到登录页面
    NProgress.done()
    if (getToken()) {
      // 移除本地的token
      removeToken()
      window.location.reload() // 重新刷新页面
    }
    return Promise.reject(error)
  })
export default service