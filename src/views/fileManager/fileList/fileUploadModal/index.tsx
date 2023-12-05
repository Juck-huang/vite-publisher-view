import { Modal, Space } from 'antd'
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { message, Upload, notification } from 'antd'
import { useContext, useState } from 'react'
import { MergeFileChunk, UploadProjectFileChunk } from '@/api/fileManage'
import { FileContext } from '../../fileContext'

const { Dragger } = Upload

// 文件上传模态框
const FileUploadModal = (props:any) => {

  const { isModalFileOpen, handleOpenFileModal, uploadPath, getFileList } = props
  const [fileList, setFileList] = useState(Array)
  const fileContext:any = useContext(FileContext)

  // 创建一个去计算md5的worker进程
  const createFileMd5InWorker = (fileChunks: any) =>{
    return new Promise((resolve)=>{
        const worker = new Worker(new URL('hash.worker.ts', import.meta.url),{type: 'module'})
        worker.postMessage({fileChunks})
        worker.onmessage = (e) => {
            // 进度条
            const { hash } = e.data
            // console.log('percentage:', percentage)
            hash && resolve(hash)
        }
    })
  }

  // 创建切片
  const createChunk = (file:File, size=1024 * 1024 * 5) => {
      const chunkList = []
      let cur = 0
      while (cur < file.size) {
          chunkList.push({
              file: file.slice(cur, cur + size)//使用slice()进行切片
          })
          cur += size
      }
      return chunkList
  }

   // 合并单个文件
  //  const mergeFile = async (fileName:string, fileHash:string) => {
  //     const params = {
  //       fileName,
  //       fileHash,
  //       pathName: uploadPath,
  //       projectId: fileContext.projectIdRef.current,
  //       projectEnvId: fileContext.projectEnvIdRef.current,
  //       projectTypeId: fileContext.projectTypeIdRef.current
  //     }
  //     const res:any = await MergeFileChunk(params)
  //     const { success } = res
  //     if (!success) {
  //         notification.open({
  //           message: '上传文件失败',
  //           description: `上传文件${fileName}失败`,
  //           duration: 30,
  //           icon: (
  //             <CloseCircleOutlined
  //               style={{
  //                 color: 'red',
  //               }}
  //             />
  //           ),
  //         })
  //         return
  //     }
  //     notification.open({
  //       message: '上传文件成功',
  //       description: `上传文件${fileName}成功`,
  //       icon: (
  //         <CheckCircleOutlined
  //           style={{
  //             color: 'green',
  //           }}
  //         />
  //       ),
  //     })
  // }

  // 上传单个文件
  const uploadFile = (chunkList:any, fileName:string, fileHash:string) => {
      return new Promise(async (resolve, reject)=>{
        const requestList = chunkList.map((res: any)=>{
          const {file, index, chunkName} = res
            const formData = new FormData() // 创建表单类型数据
            formData.append('file', file) // 文件本身
            formData.append('fileName', fileName) // 文件名
            formData.append('chunkName', chunkName) // 文件切片
            formData.append('fileHash', fileHash) // 文件hash值
            formData.append('pathName', uploadPath) // 项目文件相对路径
            formData.append('projectId', fileContext.projectIdRef.current) // 项目id
            formData.append('projectEnvId', fileContext.projectEnvIdRef.current) // 项目环境id
            formData.append('projectTypeId',fileContext.projectTypeIdRef.current) // 项目类型id
            return {formData, index}
        }).map((uploadData:any)=>{
          const {formData} = uploadData
          return UploadProjectFileChunk(formData)
        })
        await Promise.all(requestList).then(async (result)=>{
          // 只有所有的上传文件切片的请求都成功再发送合并请求
          const allSuccess = result.every(item => item.success)
          if (!allSuccess) {
            reject(`上传文件${fileName}失败,请稍后重试`)
          }
          // mergeFile(fileName, fileHash, resolve)
          const params = {
            fileName,
            fileHash,
            pathName: uploadPath,
            projectId: fileContext.projectIdRef.current,
            projectEnvId: fileContext.projectEnvIdRef.current,
            projectTypeId: fileContext.projectTypeIdRef.current
          }
          await MergeFileChunk(params).then((res:any)=>{
            const { success } = res
            if (!success) {
              notification.open({
                message: `上传文件失败`,
                description: `文件${fileName}上传失败`,
                duration: 30,
                icon: (
                  <CloseCircleOutlined
                    style={{
                      color: 'red',
                    }}
                  />
                ),
              })
              reject(`上传文件${fileName}失败`)
            }
            notification.open({
              message: '文件上传成功',
              description:  `文件${fileName}上传成功`,
              duration: 10,
              icon: (
                <CheckCircleOutlined
                  style={{
                    color: 'green',
                  }}
                />
              ),
            })
            resolve(`上传文件${fileName}成功`)
          })
        })
      })
  }

   // 点击确认
  const handleOk = async () => {
    if (!fileList.length) return message.error('请先上传文件')
    fileContext.handleLoading(true)
    handleOpenFileModal(false)
    const promiseList:any[] = []
    // 遍历需要上传的文件列表
    fileList.forEach((fileInfo:any)=>{
      // 单个文件信息
      const uploadList = fileInfo.chunkList.map((chunk:any, index:number)=>{
        return {
          file: chunk.file,
          chunkName: `${fileInfo.name}-${index}`,
          index
      }})
      // 上传文件，每个文件上传完成后单独进行合并
      promiseList.push(uploadFile(uploadList, fileInfo.name, fileInfo.hash))
    })
    // 当所有的上传请求都完成，再进行获取新的数据操作
    await Promise.all(promiseList).then((resList)=>{
      console.log('所有文件都上传完成了', resList)
      notification.open({
        message: '所有文件上传成功',
        description:  '所有文件上传成功',
        icon: (
          <CheckCircleOutlined
            style={{
              color: 'green',
            }}
          />
        ),
      })
      getFileList({
        projectId: fileContext.projectIdRef.current,
        projectEnvId: fileContext.projectEnvIdRef.current,
        projectTypeId: fileContext.projectTypeIdRef.current,
        pathName: uploadPath,
      })
      fileContext.handleLoading(false)
    }).catch((err:any)=>{
      notification.open({
          message: '上传文件失败',
          description: err,
          duration: 30,
          icon: (
            <CloseCircleOutlined
              style={{
                color: 'red',
              }}
            />
          ),
        })
    })
  }
  // // 点击确认
  // const handleOk = () => {
  //   if (!fileList.length) return message.error('请先上传文件')
  //   fileContext.handleLoading(true)
  //   // 参数
  //   setFileList([])
  //   handleOpenFileModal(false)
  //   // 上传文件时如果是多个文件，则每个文件单独发送请求上传，互不影响，最终返回所有文件的上传结果状态
  //   const promiseList:any[] = []
  //   fileList.forEach((file:any) => {
  //     const p:any = new Promise((resove,reject)=>{
  //       const formData = new FormData()
  //       formData.append('file',file)
  //       formData.append('projectId', fileContext.projectIdRef.current)
  //       formData.append('projectEnvId', fileContext.projectEnvIdRef.current)
  //       formData.append('projectTypeId', fileContext.projectTypeIdRef.current)
  //       formData.append('pathName', uploadPath)
  //       UploadProjectFile(formData).then((res:any)=>{
  //         if (res.success) {
  //           notification.open({
  //             message: '上传文件成功',
  //             description: res.message,
  //            icon: (
  //              <CheckCircleOutlined
  //                style={{
  //                  color: 'green',
  //                }}
  //              />
  //            ),
  //          })
  //         } else {
  //          notification.open({
  //            message: '上传文件失败',
  //            description: res.message,
  //            duration: 30,
  //            icon: (
  //              <CloseCircleOutlined
  //                style={{
  //                  color: 'red',
  //                }}
  //              />
  //            ),
  //          })
  //         }
  //         resove(res)
  //       }).catch(err=>{
  //        message.error("上传文件失败:"+err)
  //        reject(err)
  //       })
  //     })
  //     promiseList.push(p)
  //   })
  //   Promise.all(promiseList).then(()=>{
  //     getFileList({
  //       projectId: fileContext.projectIdRef.current,
  //       projectEnvId: fileContext.projectEnvIdRef.current,
  //       projectTypeId: fileContext.projectTypeIdRef.current,
  //       pathName: uploadPath,
  //     })
  //     fileContext.handleLoading(false)
  //   })
  // }

  // 点击取消
  const handleCancel = () => {
    handleOpenFileModal(false)
  }

  // 文件发送变化时触发
  // const handleFileChange = (info:any) => {
    // console.log('change', fileList)
    // 如果是上传文件则计算文件的md5,移除则不需要
    // if(!fileList.includes(info.file)) {
      // setFileList(files => [...files, info.file])
    // }
    // console.log('info', info.file, fileList)
  // }

  // 改为手动上传
  const handleBeforeUpload = async (file:any) => {
    // 创建文件切片列表
    const chunkList = createChunk(file)
    // 生成文件的md5值，并存储
    const fileHash = await createFileMd5InWorker(chunkList)
    const fileInfo = {
      uid: file.uid,
      name: file.name,
      hash: fileHash,
      chunkList
    }
    // console.log('handleBeforeUpload',fileInfo)
    setFileList(info => [...info, fileInfo])
    return false
  }

  // 点击移除文件时的回调
  const handleFileRemove = (file:any) => {
    const newFileList = fileList.filter((item:any) => item.uid !== file.uid)
    setFileList(() => {
      // console.log('newFileList', newFileList)
      return [...newFileList]
    })
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
            // onChange={handleFileChange}
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