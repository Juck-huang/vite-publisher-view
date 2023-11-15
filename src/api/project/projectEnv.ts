import request from '@/utils/request'

// 获取项目环境列表
export function GetProjectEnvList(data:any){
    return request({
        method: 'post',
        url: '/rest/project/getProjectEnvList',
        data,
    })
}