import { createRef, useEffect, useRef, useState } from 'react'
import ProjectList from './projectList'
import FileList from './fileList'
import './index.scss'
import { Spin } from 'antd'
import { FileContext } from './fileContext'

// 文件管理
const FileManager = () => {
    
    const [loading, setLoading] = useState(false) // 页面加载中
    const [projectId, setProjectId] = useState(null) // 项目id
    const [projectEnvId, setProjectEnvId] = useState(null) // 项目环境id
    const [projectTypeId, setProjectTypeId] = useState(null) // 项目类型id
    const projectIdRef:any = useRef()
    const projectEnvIdRef:any = useRef()
    const projectTypeIdRef:any = useRef()
    const fileListRef:any = createRef()
    const [isModalEditOpen, setIsModalEditOpen] = useState(false) // 编辑文件模态框打开或关闭
    const [currEditFile, setCurrEditFile] = useState({}) // 当前编辑文件信息
    // const [searchValue, setSearchValue] = useState('') // 搜索的值

    const handleLoading = (value:boolean) => {
        setLoading(value)
    }

    const handleFileEdit = (value:any, record:any) => {
        setCurrEditFile(record)
        setIsModalEditOpen(value)
    }

    const handleCurrProjectInfo = (params:any) => {
        fileListRef.current.clearBread()
        setProjectId(params.projectId)
        setProjectEnvId(params.projectEnvId)
        setProjectTypeId(params.projectTypeId)
        fileListRef.current.getFileList(params)
    }

    useEffect(()=>{
        // breadRef.current = breadcrumbList
        projectIdRef.current = projectId
        projectEnvIdRef.current = projectEnvId
        projectTypeIdRef.current = projectTypeId
      },[
        // breadcrumbList,
         projectId, projectEnvId, projectTypeId])

    return (
        <>
          <Spin spinning={loading} tip="正在处理中...">
            {/* 左侧显示项目及环境列表(tree)，右侧显示项目文件列表(table) */}
            <div className='main-container'>
                <FileContext.Provider value={{
                        // getRightFileList, // 获取右侧文件列表的方法
                        handleLoading,  // 加载中
                        handleFileEdit,  // 处理文件编辑
                        currEditFile,
                        projectIdRef,
                        projectEnvIdRef,
                        projectTypeIdRef
                    }}>
                    <ProjectList 
                        handleCurrProjectInfo={handleCurrProjectInfo} 
                    />

                    <FileList
                        ref={fileListRef}
                        isModalEditOpen={isModalEditOpen}
                    />
                </FileContext.Provider>
            </div>
          </Spin>
        </>
    )
}

export default FileManager