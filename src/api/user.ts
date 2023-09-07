import request from '@/utils/request'

// 获取用户信息
export const GetUserInfo = (data: object) => {
    return request({
        method: 'post',
        url: '/rest/user/getUserInfo',
        data
    })
}