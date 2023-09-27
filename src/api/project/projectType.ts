import request from '@/utils/request'

// 获取项目类型列表
export function GetProjectTypeList(data: object){
    return request({
        method: 'post',
        url: '/rest/project/getProjectTypeList',
        data,
    })
}