import request from '@/utils/request'

// 登录方法
export const login = (data: any) => {
    return request({
        method: 'post',
        url: '/login',
        data
    })
}