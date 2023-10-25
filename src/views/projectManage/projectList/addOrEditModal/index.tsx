import { Form, Input, message, Modal } from "antd"
import { useEffect } from "react"
const { Item } = Form

const AddOrEditModal = (props: any) => {
  const [form] = Form.useForm()

  const { 
    isAdd, 
    showAddOrEdit, 
    setShowAddOrEdit,
    data,
    tableList,
    setTableList,
  } = props
  
  const formatDate = (date:any) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 前端校验项目名称是否重复
  const checkProjectNameIsExist = (submitForm:any) => {
    // 如果是修改先过滤掉该项目id的数据，然后用其他的项目名称做重复对比
    const filterData = tableList.filter((table:any) => table.key !== submitForm.key)
    // 用已存在列表的项目名称做重复对比
    const findI = filterData.findIndex((data:any) => data.name === submitForm.name)
    if (findI === -1) return false
    return true
  }

  const handleSubmit = async () => {
    try {
      const submitForm = await form.validateFields()
      if (!submitForm.name) return
      if (data.key) {
        // 说名是编辑
        submitForm['key'] = data.key
      } 
      const nameExist = checkProjectNameIsExist(submitForm)
      if (nameExist) {
        message.error(`项目名称${submitForm.name}已存在`)
        return
      }
      if (isAdd) {
        submitForm['key'] = Math.max.apply(Math, tableList.map((item:any) => Number(item.key)+1)).toString()
        setTableList([...tableList, {...submitForm, state: 0, createTime: formatDate(new Date()), updateTime: formatDate(new Date())}])
        message.success('新建成功')
        setShowAddOrEdit(false)
      } else {
        //是修改
        const findI = tableList.findIndex((item:any) => item.key == submitForm.key)
        if (findI == -1) return message.error('修改失败')
        const filterData = tableList[findI]
        filterData.name = submitForm.name
        filterData.updateTime = formatDate(new Date())
        setTableList(tableList)
        message.success('修改成功')
        setShowAddOrEdit(false)
      }
    } catch (error) {
      console.log('submit err', error)
    } 
  }

  // 初始化数据
  const initData = () => {
    form.setFieldsValue(data)
  }

  useEffect(()=>{
    if (!isAdd) {
      initData()
    }
  },[])

  return (
    <>
      <Modal 
        title={isAdd?"新建项目":"修改项目"}
        open={showAddOrEdit}
        onCancel={()=>{setShowAddOrEdit(false)}}
        onOk={handleSubmit}
        okText="确认"
        cancelText="取消"
        maskClosable={false}
      >
          <Form
            labelCol={{
                span: 4,
            }}
            wrapperCol={{
                span: 8,
            }}
            form={form}
            layout="horizontal"
          >
            <Item
              label="项目名称" 
              name="name"
              rules={[
                  {
                      required: true,
                      message: '请输入项目名称',
                  },
              ]}
            >
                <Input placeholder="请输入项目名称" />
            </Item>
          </Form>
      </Modal>
    </>
  )
}

export default AddOrEditModal
