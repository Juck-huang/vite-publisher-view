import request from '@/utils/request'

// 获取文件内容
export function getFileContent(data:any){
    return request({
        method: 'post',
        url: '/rest/fileManager/getFileContent',
        data,
    })
}

// 保存项目文件
export function saveFileContent(data:any){
    return request({
        method: 'post',
        url: '/rest/fileManager/saveFileContent',
        data,
    })
}


// 获取项目列表
export function getProjectList(data:any){
    return request({
        method: 'post',
        url: '/rest/fileManager/getProjectList',
        data,
    })
}

// 获取项目文件列表
export function GetProjectFileList(data:any){
    return request({
        method: 'post',
        url: '/rest/fileManager/getProjectFileList',
        data,
    })
}

// 上传项目文件
export function UploadProjectFile(data:any){
    return request({
        method: 'post',
        url: '/rest/fileManager/uploadProjectFile',
        data,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    })
}

// 下载项目文件
export function DownloadProjectFile(data:any, responseType:any='blob'){
    return request({
        method: 'post',
        url: '/rest/fileManager/downloadProjectFile',
        data,
        responseType,
    })
}

// 新建项目文件夹
export function AddProjectFolder(data:any){
    return request({
        method: 'post',
        url: '/rest/fileManager/addFolder',
        data,
    })
}

// 新建项目文件
export function AddProjectFile(data:any){
    return request({
        method: 'post',
        url: '/rest/fileManager/addFile',
        data,
    })
}

// 重命名项目文件/文件夹
export function ReNameFile(data:any){
    return request({
        method: 'post',
        url: '/rest/fileManager/reNameFile',
        data,
    })
}

// 移除项目文件或文件夹
export function RemoveProjectFile(data:any){
    return request({
        method: 'post',
        url: '/rest/fileManager/removeFile',
        data,
    })
}