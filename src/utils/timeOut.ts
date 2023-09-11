import { userLogout } from "@/api/login"
import {  Modal } from "antd"
import { removeToken } from "./auth"

const updateTimeKey = 'last_update_time'
const timeOut = 1000 * 60 * 60 * 5 // 超时时间，单位毫秒
const checkTime = 1000 * 20 // 检查超时时间，单位毫秒
let timerPage: any = null

// 设置本地操作时间方法
export const setOperationTime = () => {
    localStorage.setItem(updateTimeKey, new Date().getTime().toString())
}

// 获取本地操作时间方法
export const getOperationTime = () => {
    return Number(localStorage.getItem(updateTimeKey))
}

// 移除本地操作时间方法
export const removeOperationTime = () => {
    return localStorage.removeItem(updateTimeKey)
}

// 检查超时时间
export const checkTimeout = () => {
    const currentTime = new Date().getTime()
    const lastUpdateTime: any = getOperationTime()
    // 登录页不需要超时提示
    const routerPage = window.location.hash.split('#/')[1]
    if (routerPage !== 'login') {
        console.log('检查用户操作开始')
        // 超时时间超过指定时间就调用登录接口
        if (currentTime - lastUpdateTime > timeOut) {
            window.clearInterval(timerPage)
            console.log('清理定时器完成，调用登出接口完毕，重新建立定时器完成')
            userLogout({}).then((res: any)=>{
                if (res.success) {
                    Modal.confirm({
                        title: '提示',
                        content: '登录已过期，请重新登录',
                        okText: '确认',
                        maskClosable: false,
                        centered: true,
                        cancelButtonProps: {
                            style: {
                                display: 'none'
                            }
                        },
                        onOk: () => {
                            // 移除本地的token
                            removeToken()
                            removeOperationTime()
                            window.location.reload() // 重新刷新页面
                        },
                        onCancel: () => {
                            console.log('取消对话框')
                            removeToken()
                            removeOperationTime()
                            window.location.reload() // 重新刷新页面
                        }
                    })
                }
            })
            // timerPage = window.setInterval(checkTimeout, checkTime)
        }
    }
}

timerPage = window.setInterval(checkTimeout, checkTime)