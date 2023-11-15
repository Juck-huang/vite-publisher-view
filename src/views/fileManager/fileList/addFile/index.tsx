import { Form, Input, message, Modal } from 'antd'
import { useContext } from 'react'
import { AddProjectFile } from '@/api/fileManage'
import { FileContext } from '../../fileContext'

 // 新建文件
const AddFile = (props:any) => {
  const { isModalAddFile, handleFileModalOpen, breadcrumbList, getFileList } = props
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
            pathName: breadcrumbList.at(-1)?.key || '',
            addFileName: res.name
        }
        const result:any = await AddProjectFile(params)
        if (result.success) {
            message.success(result.message)
            delete params.addFileName
            await getFileList(params)
            handleFileModalOpen(false)
        } else {
            message.error(result.message)
        }
        handleLoading(false)
    }).catch(err => {
        console.error('验证失败:'+err)
    })
  }

  const handleCancel = () => {
    handleFileModalOpen(false)
  }

  return (
    <>
        <Modal
            title="新建文件" 
            open={isModalAddFile} 
            onOk={handleOk} 
            onCancel={handleCancel}
            okText='确认'
            cancelText='取消'
            width={360}
        >
            <Form
                name="addFile"
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
                    label="名称"
                    name="name"
                    rules={[
                    {
                        required: true,
                        message: '请输入新建文件名称',
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

export default AddFile