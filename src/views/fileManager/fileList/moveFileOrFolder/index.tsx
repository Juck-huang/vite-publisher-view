import { Form, Input, message, Modal, Space } from 'antd'
import { useContext } from 'react'
import { AddProjectFile } from '@/api/fileManage'
import { FileContext } from '../../fileContext'

 // 移动文件或文件夹
const MoveFileOrFolder = (props:any) => {
  const { isModalMoveFileOrFolder, handleModalMoveFileOrFolderOpen, breadcrumbList, getFileList, currClickFileName } = props
  const [form] = Form.useForm()
  const { 
    projectIdRef,
    projectEnvIdRef, 
    projectTypeIdRef,
    handleLoading
  }:any = useContext(FileContext)

  const handleOk =  () => {
    form.validateFields().then(async res => {
        handleLoading(true)
        const params:any = {
            projectId: projectIdRef.current,
            projectEnvId: projectEnvIdRef.current,
            projectTypeId: projectTypeIdRef.current,
            pathName: breadcrumbList.slice(-1)[0]?.key || '',
            addFileName: res.name
        }
        const result:any = await AddProjectFile(params)
        if (result.success) {
            message.success(result.message)
            delete params.addFileName
            await getFileList(params)
            handleModalMoveFileOrFolderOpen(false)
        } else {
            message.error(result.message)
        }
        handleLoading(false)
    }).catch(err => {
        console.error('验证失败:'+err)
    })
  }

  const handleCancel = () => {
    handleModalMoveFileOrFolderOpen(false)
  }

  return (
    <>
        <Modal
            title="移动文件/文件夹" 
            open={isModalMoveFileOrFolder} 
            onOk={handleOk} 
            onCancel={handleCancel}
            okText='确认'
            cancelText='取消'
            width={550}
        >
            <Form
                name="moveFileOrFolder"
                labelCol={{
                    span: 0,
                }}
                wrapperCol={{
                    span: 16,
                }}
                form={form}
                autoComplete="off"
            >
                <Form.Item
                    label="原路径"
                    name="filePath"
                >
                   {`${breadcrumbList.slice(-1)[0]?.key || '/'}`}
                </Form.Item>
                <Form.Item
                    label="名称"
                    name="fileName"
                >
                   {currClickFileName}
                </Form.Item>
                <Form.Item
                    label="新路径"
                    name="path"
                >
                    ssss
                </Form.Item>
            </Form>
        </Modal>
    </>
  )
}

export default MoveFileOrFolder