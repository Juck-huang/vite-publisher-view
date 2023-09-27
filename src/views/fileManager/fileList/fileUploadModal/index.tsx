import { Modal, Space } from 'antd'
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { message, Upload, notification } from 'antd'
import { useContext, useState } from 'react'
import { UploadProjectFile } from '@/api/fileManage'
import { FileContext } from '../../fileContext'

const { Dragger } = Upload

// 文件上传模态框
const FileUploadModal = (props:any) => {

  const { isModalFileOpen, handleOpenFileModal, uploadPath, getFileList } = props
  const [fileList, setFileList] = useState(Array)
  const fileContext:any = useContext(FileContext)
  
  // 点击确认
  const handleOk = () => {
    if (!fileList.length) return message.error('请先上传文件')
    fileContext.handleLoading(true)
    // 参数
    setFileList([])
    handleOpenFileModal(false)
    // 上传文件时如果是多个文件，则每个文件单独发送请求上传，互不影响，最终返回所有文件的上传结果状态
    const promiseList:any[] = []
    fileList.forEach((file:any) => {
      const p:any = new Promise((resove,reject)=>{
        const formData = new FormData()
        formData.append('file',file)
        formData.append('projectId', fileContext.projectIdRef.current)
        formData.append('projectEnvId', fileContext.projectEnvIdRef.current)
        formData.append('projectTypeId', fileContext.projectTypeIdRef.current)
        formData.append('pathName', uploadPath)
        UploadProjectFile(formData).then((res:any)=>{
          if (res.success) {
            notification.open({
              message: '上传文件成功',
              description: res.message,
             icon: (
               <CheckCircleOutlined
                 style={{
                   color: 'green',
                 }}
               />
             ),
           })
          } else {
           notification.open({
             message: '上传文件失败',
             description: res.message,
             duration: 30,
             icon: (
               <CloseCircleOutlined
                 style={{
                   color: 'red',
                 }}
               />
             ),
           })
          }
          resove(res)
        }).catch(err=>{
         message.error("上传文件失败:"+err)
         reject(err)
        })
      })
      promiseList.push(p)
    })
    Promise.all(promiseList).then(()=>{
      getFileList({
        projectId: fileContext.projectIdRef.current,
        projectEnvId: fileContext.projectEnvIdRef.current,
        projectTypeId: fileContext.projectTypeIdRef.current,
        pathName: uploadPath,
      })
      fileContext.handleLoading(false)
    })
  }

  // 点击取消
  const handleCancel = () => {
    handleOpenFileModal(false)
  }

  // 改为手动上传
  const handleBeforeUpload = (file:any) => {
    setFileList(info => [...info, file])
    return false
  }

  // 点击移除文件时的回调
  const handleFileRemove = (file:any) => {
    setFileList(fileList.filter((item:any) => item.uid !== file.uid))
  }

  return (
    <>
        <Modal 
          title="文件上传" 
          open={isModalFileOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          width={650}
          cancelText='取消'
          okText='上传'
          maskClosable={false}
        >
          <Space size={5}>
            上传目录：{uploadPath}
          </Space>
          {/* 支持拖拽上传 */}
          <Dragger 
            name='file'
            maxCount={5}
            beforeUpload={handleBeforeUpload}
            multiple={true}
            onChange={()=>{}}
            onRemove={handleFileRemove}
            height={230}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">请拖拽或选择文件至页面进行上传(支持多文件)</p>
          </Dragger>
        </Modal>
    </>
  )
}

export default FileUploadModal