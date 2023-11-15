import request from '@/utils/request'

// 导出或备份整个数据库
export function exportOrBakUpDatabase(data:any, responseType:any){
    return request({
        method: 'post',
        url: '/rest/database/total/export',
        data,
        responseType
    })
}

// 单独导出多个表
export function singleExportTables(data:any){
    return request({
        method: 'post',
        url: '/rest/database/single/export',
        data,
        responseType: 'blob'
    })
}

// 获取数据库和对应的数据表列表
export function getDatabaseAndTableList(data:any){
    return request({
        method: 'post',
        url: '/rest/database/dbAndTable/list',
        data
    })
}

// 动态执行sql
export function dynamicExecSql(data:any){
    return request({
        method: 'post',
        url: '/rest/database/dynamic/execSql',
        data
    })
}

// 执行sql文件
export function execSqlFile(formData:any){
    return request({
        method: 'post',
        url: '/rest/database/execSqlFile',
        data: formData,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    })
}