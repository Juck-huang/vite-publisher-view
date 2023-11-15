import { Button, Card, Modal, Space, Switch, Table, Tag } from 'antd'
import { useState } from 'react'

// 应用管理组件
const Manage = () => {

  const [columns, 
    // setColumns
  ] = useState([
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '项目环境',
      dataIndex: 'env',
      key: 'env',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any) => (
        <Space size="middle">
          <span style={{cursor: 'pointer', color: 'blue'}} onClick={()=>{handleManageProject()}}>应用管理</span>
        </Space>
      )
    }
  ]) // 项目列

  const [data, 
    // setData
  ] = useState([{
    key: '1',
    name: '城盾隧安信息化管控平台',
    id: 1,
    env: '拟真环境'
  },
  {
    key: '2',
    name: '城盾隧安信息化管控平台',
    id: 2,
    env: '试运行环境'
  }]) // 项目数据

  const [manageModalOpen, setManageModalOpen] = useState(false) // 应用管理模态框打开

  const handleRunChecked = (checked:boolean, record:any) => {
    setTableData(table => {
      const newTableData = JSON.parse(JSON.stringify(table))
      newTableData.forEach((item:any) => {
        if (item.key === record.key) {
          checked ? item.status = 1:item.status = 0
        }
      })
      return newTableData
    })
  }// 运行或停止项目处理

  const handleDaemonChecked = (checked: boolean, record:any) => {
    console.log(checked, record)
  } // 守护进程点击处理

  const [tableColumns, 
    // setTableColumns
  ] = useState([
    {
      title: '应用名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      key: 'status',
      render: (text:string) => text ? <Tag color="green">正常</Tag> : <Tag color="red">停止</Tag>
    },
    {
      title: '运行/停止',
      dataIndex: 'status',
      key: 'status',
      render: (_:any, record:any) => <Switch checked={record.status?true:false} onClick={(checked)=>{handleRunChecked(checked, record)}} />
    },
    {
      title: '开启守护进程',
      dataIndex: 'isDaemon',
      key: 'isDaemon',
      render: (_:any, record:any) => <Switch checked={record.isDaemon} onClick={(checked)=>{handleDaemonChecked(checked, record)}} />
    },
    {
      title: '实时日志',
      dataIndex: 'realTimeLog',
      key: 'realTimeLog',
      render: (_:any) => <Button type="primary" size='small'>预览</Button>
    },
  ]) // 管理对话框表格列
  const [tableData, setTableData] = useState([
    {
      key: '1',
      name: 'stec-emerge-service',
      status: 0,
      isDaemon: true
    },
    {
      key: '2',
      name: 'stec-emerge-web',
      status: 1,
      isDaemon: false
    },
  ]) // 管理对话框表格数据

  const handleManageProject = () => {
    setManageModalOpen(true)
  } // 处理进入项目管理

  return (
    <>
        <Card
            title="应用管理"
            extra={<></>}
            bordered={false}
        >
            <Table 
              dataSource={data}
              columns={columns}
              pagination={{
                hideOnSinglePage: true
              }}
            />
        </Card>

        <Modal
          title={`管理`}
          open={manageModalOpen} 
          onCancel={()=>{setManageModalOpen(false)}}
          footer={null}
          width={1000}
          maskClosable={false}
          >
            <Table columns={tableColumns} dataSource={tableData} />
        </Modal>
    </>
  )
}

export default Manage