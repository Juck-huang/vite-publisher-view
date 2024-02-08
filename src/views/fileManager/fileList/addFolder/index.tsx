import { Form, Input, message, Modal } from 'antd'
import { useContext } from 'react'
import { AddProjectFolder } from '@/api/fileManage'
import { FileContext } from '../../fileContext'

 const AddFolder = (props:any) => {
  const { isModalAddFolder, handleFolderModalOpen, breadcrumbList, getFileList } = props
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
        const params = {
            projectId: projectIdRef.current,
            projectEnvId: projectEnvIdRef.current,
            projectTypeId: projectTypeIdRef.current,
            pathName: breadcrumbList.slice(-1)[0]?.key || '',
            addFolderName: res.name
        }
        const result:any = await AddProjectFolder(params)
        if (result.success) {
            message.success(result.message)
            delete params.addFolderName
            await getFileList(params)
            handleFolderModalOpen(false)
        } else {
            message.error(result.message)
        }
        handleLoading(false)
    }).catch(err => {
        console.error('验证失败:'+err)
    })
  }

  const handleCancel = () => {
    handleFolderModalOpen(false)
  }

  return (
    <>
        <Modal
            title="新建文件夹" 
            open={isModalAddFolder} 
            onOk={handleOk} 
            onCancel={handleCancel}
            okText='确认'
            cancelText='取消'
            width={360}
        >
            <Form
                name="addFolder"
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
                        message: '请输入新建文件夹名称',
                    },
                    {
                        pattern: new RegExp('^[0-9a-zA-Z\u4e00-\u9fa5_-]+$', 'g'),
                        message: '只允许包含中文、数字、字母、下划线和横杠'
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

export default AddFolder