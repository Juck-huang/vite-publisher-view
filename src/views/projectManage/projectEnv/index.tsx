import { Card, Table, Space, Switch, Button, message, Modal, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import AddOrEditModal from './addOrEditModal'

interface DataType {
  key: string;
  projectName: string;
  projectId: number;
  name: string;
  state: number;
  createTime: string;
  updateTime: string;
}

 // 项目环境组件 
 const ProjectEnv = () => {
  const [tableData,setTableData] = useState<DataType[]>([]) // 表格数据
  const [showAddOrEdit,setShowAddOrEdit] = useState(false) // 是否显示新增或编辑页面
  const [isAdd, setIsAdd] = useState(false) // 是否是新增
  const [modalData, setModalData] = useState<DataType>() // 编辑时的数据传输
  const [projectOptions, setProjectOptions] = useState([]) // 项目下列框
  const [selectProjectId, setSelectProjectId] = useState<number>() // 选中的项目id
  
  const columns: ColumnsType<DataType> = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      render: text => <span>{text}</span>,
    },
    {
      title: '环境名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <span>{text}</span>,
    },
    {
      title: '环境状态',
      dataIndex: 'state',
      key: 'state',
      render: (_, record:any) => <Switch checkedChildren="启用" unCheckedChildren="关闭" defaultChecked={record.state == 1} onChange={(value)=>handleSwitchChange(value, record.key)} />,
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
            // 删除按钮只有在项目状态为0(0，关闭，1，启用)时才显示出来
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

  // 处理搜索
  const handleSearch = (selectPId:any) => {
    if (!selectPId) {
      console.log(tableData)
      return
    }
    const filterData = tableData.filter((item:DataType) => item.projectId === selectPId)
    console.log('filterData', selectProjectId, filterData)
  }

  const handleResetSearch = () => {
    console.log('reset')
    setSelectProjectId(()=>{
      const clear = undefined
      handleSearch(clear)
      return clear
    })
  }

  useEffect(()=>{
    const data:DataType[] = [
      {
        key: '1',
        projectName: '城盾隧安信息化管控平台项目',
        projectId: 1,
        name: '正式环境',
        state: 1,
        createTime: '2023-10-18 16:30:01',
        updateTime: '2023-10-18 16:31:01'
      },
      {
        key: '3',
        projectName: '城盾隧安项目',
        projectId: 1,
        name: '试运行',
        state: 1,
        createTime: '2023-10-24 16:30:59',
        updateTime: '2023-10-24 16:31:59'
      },{
        key: '2',
        projectName: '海口桥隧',
        name: '正式环境',
        projectId: 3,
        state: 0,
        createTime: '2023-10-18 16:30:59',
        updateTime: '2023-10-18 16:31:59'
      },{
        key: '4',
        projectName: '环莞三期',
        name: '正式环境',
        projectId: 2,
        state: 0,
        createTime: '2023-10-18 16:30:59',
        updateTime: '2023-10-18 16:31:59'
      },
    ]
    setTableData(data)
    let projectData:any = []
    let projectObj:any = {} // 项目id为key，项目名称为值
    data.forEach((item:DataType) =>{
      if (!projectObj[item.projectId]) {
        projectObj[item.projectId] = item.projectName
      }
    })
    for (let key in projectObj) {
      projectData.push({label: projectObj[key], value: Number(key)})
    }
    setProjectOptions(projectData)
  },[])

  return (
    <>
      <Card title="项目环境" size='small'>
        <Space size='small' style={{ marginBottom: 10 }}>
          项目名称: 
            <Select
              showSearch
              allowClear
              style={{ width: 120 }}
              placeholder="请选择项目"
              value={selectProjectId}
              options={projectOptions}
              optionFilterProp="children"
              onChange={(value:any)=>{setSelectProjectId(value)}}
              filterOption={(input, option:any) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
            <Button type="primary" onClick={()=>{handleSearch(selectProjectId)}}>查询</Button>
            <Button type="primary" onClick={handleResetSearch}>重置</Button>
            <Button type="primary" onClick={handleAdd}>新建环境</Button>
        </Space>
        <Table columns={columns} dataSource={tableData} />
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

export default ProjectEnv