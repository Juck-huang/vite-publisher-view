import request from '@/utils/request'

// 获取项目列表
export function GetProjectList(data){
    return request({
        method: 'post',
        url: '/rest/project/list',
        data,
    })
}