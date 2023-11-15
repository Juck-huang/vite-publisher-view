import { Form, Input, message, Modal } from 'antd'
import { useContext } from 'react'
import { ReNameFile } from '@/api/fileManage'
import { FileContext } from '../../fileContext'

 // 重命名文件或文件夹
const RenameFileOrFolder = (props:any) => {
  const 
  { 
    isModalRenameFile, 
    handleRenameFileModalOpen, 
    breadcrumbList, 
    getFileList, 
    currClickFileName 
  } = props
  const [form] = Form.useForm()
  const { 
    projectIdRef,
    projectEnvIdRef, 
    projectTypeIdRef,
    handleLoading
  }:any = useContext(FileContext)

  const handleOk =  () => {
    form.validateFields().then(async () => {
        handleLoading(true)
        const params:any = {
            projectId: projectIdRef.current,
            projectEnvId: projectEnvIdRef.current,
            projectTypeId: projectTypeIdRef.current,
            pathName: `${breadcrumbList.at(-1)?.key || ''}/${currClickFileName}`, // 原文件/文件夹相对路径
            newFileName: `${form.getFieldValue('newName')}`  // 新文件/文件夹相对路径
        }
        const result:any = await ReNameFile(params)
        if (result.success) {
            message.success(result.message)
            delete params.newFileName
            params.pathName = breadcrumbList.at(-1)?.key || ''
            handleRenameFileModalOpen(false)
            await getFileList(params)
        } else {
            message.error(result.message)
        }
        handleLoading(false)
    }).catch(err => {
        console.error('验证失败:'+err)
    })
  }

  const handleCancel = () => {
    handleRenameFileModalOpen(false)
  }

  return (
    <>
        <Modal
            title="重命名" 
            open={isModalRenameFile} 
            onOk={handleOk} 
            onCancel={handleCancel}
            okText='确认'
            cancelText='取消'
            width={360}
        >
            <Form
                name="renameFile"
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
                    label="根路径"
                    name="filePath"
                >
                   {
                       `${breadcrumbList.at(-1)?.key || '/'}`
                   }
                </Form.Item>
                <Form.Item
                    label="原名称"
                    name="originName"
                >
                   {
                       currClickFileName
                   }
                </Form.Item>
                <Form.Item
                    label="新名称"
                    name="newName"
                    rules={[
                    {
                        required: true,
                        message: '请输入新的文件/文件夹名称',
                    },
                    {
                        pattern: new RegExp('^[0-9a-zA-Z\u4e00-\u9fa5_.-]+$', 'g'),
                        message: '只允许包含中文、数字、字母、下划线、点和横杠'
                    }
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    </>
  )
}

export default RenameFileOrFolder