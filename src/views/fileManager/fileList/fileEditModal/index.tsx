import { Modal, Space, message } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import MyCodeMiddor from '@/components/myCodeMirror'
import { FileContext } from '../../fileContext'
import { getFileContent } from '@/api/fileManage'
import { saveFileContent } from '@/api/fileManage'

// 文件编辑模态框
const FileEditModal = (props:any) => {
  const { isModalEditOpen, filePath } = props
  const [codeValue, setCodeValue] = useState('')
  const { 
    handleFileEdit,
    projectIdRef,
    projectEnvIdRef, 
    projectTypeIdRef,
    currEditFile,
    handleLoading
  }:any = useContext(FileContext)

  const handleOk = async () => {
    handleLoading(true)
    const params = {
        projectId: projectIdRef.current,
        projectEnvId: projectEnvIdRef.current,
        projectTypeId: projectTypeIdRef.current,
        pathName: `${filePath}/${currEditFile.key}`,
        fileContent: codeValue
    }
    const res:any = await saveFileContent(params)
    handleFileEdit(false)
    if(res.success) {
        message.success(`编辑文件${currEditFile.key}成功`)
    } else {
        message.error(`编辑文件${currEditFile.key}失败,失败原因：${res.message}`)
    }
    handleLoading(false)
  }

  const handleCancel = () => {
    console.log('handleCancel')
    handleFileEdit(false)
  }

  const getFileText = useCallback(async () => {
    console.log('获取文件文本', filePath, currEditFile)
    const params = {
        projectId: projectIdRef.current,
        projectEnvId: projectEnvIdRef.current,
        projectTypeId: projectTypeIdRef.current,
        pathName: `${filePath}/${currEditFile.key}`
    }
    const res:any = await getFileContent(params)
    if (res.success) {
        setCodeValue(res.result)
    }
  },[currEditFile, filePath, projectEnvIdRef, projectIdRef, projectTypeIdRef])

  useEffect(()=>{
    getFileText()
  },[getFileText])

  return (
    <>
        <Modal
          title="文件编辑" 
          open={isModalEditOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          width={900}
          cancelText='取消'
          okText='提交'
          maskClosable={false}
        >
          <Space size={5}>
            代码格式
          </Space>
          <MyCodeMiddor 
            codeValue={codeValue}
            setCodeValue={setCodeValue}
            codeType={currEditFile.extName}
            height='500px'
          />
        </Modal>
    </>
  )
}

export default FileEditModal