import { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { 
    Modal,
    Space,
    Button,
    Upload,
    message,
    Select,
  } from 'antd'
import { execSqlFile } from '@/api/database'

// 执行sql文件组件
 const ExecSqlFile = (props:any) => {
  const {
      execSqlModalOpen,
      handleExecSqlModalClick,
      loading,
      handleLoading,
      dbTableOption
  } = props
  const [fileList, setFileList] = useState(Array) // 上传附件列表
  const [selectDb, setSelectDb] = useState('') // 已选择的数据库

  const handleBeforeUpload = (file:any) => {
    setFileList([...fileList, file])
    return false
  }

  // 处理提交的上传文件
  const handleSubmitUpload = () => {
    if (!selectDb) {
        message.error('请先选择数据库')
        return
    }
    if(!fileList.length) {
        message.error('请先上传sql文件')
        return
    }
    const formData = new FormData()
    fileList.forEach((file:any)=>{
        formData.append('file', file)
    })
    formData.append('dbName', selectDb)
    handleLoading(true)
    handleExecSqlModalClick(false)
    execSqlFile(formData).then((res:any)=>{
        if (res.success){
            message.success(res.message)
        } else {
            message.error(res.message)
        }
        handleLoading(false)
    })
  }

  // 选择db后的回调
  const handleSelectDbChange = (value:string) => {
    setSelectDb(value)// 设置选择db后的数据
  }

  return (
    <>
        <Modal
        title='执行sql文件'
        open={execSqlModalOpen}
        onOk={handleSubmitUpload}
        okText='执行'
        cancelText="取消"
        onCancel={()=>handleExecSqlModalClick(false)}
        okButtonProps={
          {
            disabled: loading
          }
        }
      >
        <Space>
            选择数据库：
                <Select
                    style={{
                        width: 130,
                        marginLeft: 18
                    }}
                    showSearch
                    onChange={handleSelectDbChange}
                    allowClear
                    options={Object.keys(dbTableOption).map(db=>({
                      label: db,
                      value: db,
                    }))}
                    placeholder='请选择数据库'
                    filterOption={(input, option:any)=>{
                      return option.label.indexOf(input) !== -1
                    }}
                />
        </Space>
        <Space style={{marginTop: 10}}>
            请上传sql文件：
            <Upload 
                beforeUpload={(file)=> handleBeforeUpload(file)}
                accept='.sql'
                name='file'
                maxCount={1}
            >
                <Button icon={<UploadOutlined />}>sql文件(限制1个)</Button>
            </Upload>
        </Space>
      </Modal>
    </>
  )
}

export default ExecSqlFile
