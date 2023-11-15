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