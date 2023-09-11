import request from '@/utils/request'

// 登录方法
export const login = (data: any) => {
    return request({
        method: 'post',
        url: '/login',
        data
    })
}

// 登出方法
export const userLogout = (data: any) => {
    return request({
        method: 'post',
        url: 'rest/user/logout',
        data
    })
}