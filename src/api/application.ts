import request from '@/utils/request'

// 上传文件
export function releaseProject(data:any){
    return request({
        method: 'post',
        url: '/rest/publish/release',
        data,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    })
}

// 获取应用信息列表
export function getAppList(data:any){
    return request({
        method: 'post',
        url: '/rest/application/manage/list',
        data,
    })
}

// 开启/关闭/重启应用
export function startOrStopApp(data:any){
    return request({
        method: 'post',
        url: '/rest/application/manage/startOrStopApp',
        data,
    })
}