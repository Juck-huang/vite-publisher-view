import { Card, Table, Space, Switch, Button, message, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react';
import AddOrEditModal from './addOrEditModal';

interface DataType {
  key: string;
  name: string;
  state: number;
  createTime: string;
  updateTime: string;
}

 // 项目列表组件 
 const ProjectList = () => {
  const [tableData,setTableData] = useState<DataType[]>([])
  const [showAddOrEdit,setShowAddOrEdit] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [modalData, setModalData] = useState<DataType>() // 编辑时的数据传输
  
  const columns: ColumnsType<DataType> = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '项目状态',
      dataIndex: 'state',
      key: 'state',
      render: (_, record:any) => <Switch checkedChildren="运行" unCheckedChildren="关闭" defaultChecked={record.state == 1} onChange={(value)=>handleSwitchChange(value, record.key)} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <span>{text}</span>,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: text => <span>{text}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <div style={{color: 'blue', cursor: 'pointer'}} onClick={()=>handleEdit(record)}>编辑</div>
          {
            // 删除按钮只有在项目状态为0(0，关闭，1，运行)时才显示出来
            !record.state ? <div style={{color: 'blue', cursor: 'pointer'}} onClick={()=>handleDelete(record)}>删除</div>: <></>
          }
        </Space>
      ),
    },
  ]

  const handleSwitchChange = (value:any, key:any) => {
    const findI = tableData.findIndex(table => table.key === key)
    tableData[findI].state = value?1:0
    setTableData([...tableData])
  }

  const handleEdit = (record:DataType) => {
    setModalData(record)
    setShowAddOrEdit(true)
    setIsAdd(false)
  }

  const handleDelete = (record:DataType) =>{
    Modal.confirm({
      title: '提示',
      content: '删除操作不可逆，确认删除？',
      okText: '确认',
      cancelText: '取消',
      maskClosable: false,
      centered: true,
      onOk: () => {
        setTableData(tableData.filter(item => item.key != record.key))
      }
    })
  }

  // 点击新增处理
  const handleAdd = () => {
    const nullData: any = {}
    setModalData(nullData)
    setShowAddOrEdit(true)
    setIsAdd(true)
  }

  useEffect(()=>{
    const data:DataType[] = [
      {
        key: '1',
        name: '城盾隧安',
        state: 1,
        createTime: '2023-10-18 16:30:01',
        updateTime: '2023-10-18 16:31:01'
      },
      {
        key: '3',
        name: '东莞路桥',
        state: 1,
        createTime: '2023-10-24 16:30:59',
        updateTime: '2023-10-24 16:31:59'
      },{
        key: '2',
        name: '海口桥隧',
        state: 0,
        createTime: '2023-10-18 16:30:59',
        updateTime: '2023-10-18 16:31:59'
      },
    ]
    setTableData(data)
  },[])

  return (
    <>
      <Card title="项目列表" size='small' extra={
        <>
          <Button type="primary" onClick={handleAdd}>新建项目</Button>
        </>
      }>
        <Table columns={columns} dataSource={tableData} locale={{emptyText: '暂无数据'}} />
      </Card>

      {
        // 新增或编辑对话框
        showAddOrEdit ? 
          <AddOrEditModal 
            isAdd={isAdd}
            showAddOrEdit={showAddOrEdit}
            setShowAddOrEdit={setShowAddOrEdit}
            data={modalData}
            tableList={tableData}
            setTableList={setTableData}
          />: <></>
      }
    </>
  )
}

export default ProjectList