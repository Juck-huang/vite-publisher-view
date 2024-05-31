import { getAppList, startOrStopApp } from '@/api/application'
import { Button, Card, message, Popconfirm, Space, Switch, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

interface DataType {
  key: string,
  name: string, // 名称
  runStatus: number, // 运行状态，运行/停止
  packageTime: string, // 包发布时间
  runTime: string, // 运行时长
  startTime: string, // 启动时间
  devLanauge: string, //开发语言
}

// 应用管理组件
const Manage = () => {

  // 表格数据
  const [dataSource, setDataSource] = useState<Array<DataType>>([]) 

  // 表格列
  const tableColumns: ColumnsType<DataType> = [
    {
      title: '应用名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '运行状态',
      dataIndex: 'runStatus',
      key: 'runStatus',
      render: (text:string) => text ? <Tag color="green">正常</Tag> : <Tag color="red">停止</Tag>
    },
    {
      title: '包发布时间',
      dataIndex: 'packageTime',
      key: 'packageTime',
    },
    {
      title: '启动时间',
      dataIndex: 'startTime',
      key: 'startTime',
      align: 'center',
    },
    {
      title: '运行时长',
      dataIndex: 'runTime',
      key: 'runTime',
      align: 'center',
    },
    {
      title: '开发语言',
      dataIndex: 'devLanauge',
      key: 'devLanauge',
      align: 'center',
    },
    {
      title: '运行/停止',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (_:any, record:any) => <>
        <Popconfirm
          title={`确认${record.runStatus===true?"关闭":"开启"}应用？`}
          onConfirm={()=>{runOrStopApp(!record.runStatus, record)}}
          okText="确认"
          cancelText="取消"
        >
          <Switch checked={record.runStatus} />
        </Popconfirm>
      </>
    },
    {
      title: '操作',
      key: '',
      dataIndex: '',
      align: 'center',
      render: (_:any, record:any) => (<>
        <Popconfirm
          title="确认重启应用?"
          onConfirm={()=>{restartApp(record)}}
          okText="确认"
          cancelText="取消"
        >
          <Button type="primary" size='small'>重启</Button>
        </Popconfirm>
        &nbsp;
        <Button type="primary" size='small'>日志预览</Button>&nbsp;
        <Button type="primary" size='small'>编辑配置</Button>
      </>)
    },
  ]


  // 获取应用数据列表
  const getAppData = async () => {
    const res:any = await getAppList({})
    if (res.success) {
      res.result.forEach((item:any) => {
        item.key = item.id
      })
      setDataSource(res.result)
    }
  }

  // 运行或停止应用
  const runOrStopApp = async (checked:boolean, record: any) => {
    // 如果当前应用已经是正在运行，则无法再次运行
    if(record.runStatus === checked) return message.error('当前应用已经开启，无需再次开启')

    let direct: string = 'start'
    if(!checked) {
      direct = 'stop'
    }
    const res:any = await startOrStopApp({
      id: `${record.id}`,
      direct,
    })
    if(res.success) {
      await getAppData()
      message.success(res.message)
    } else {
      return message.error(res.message)
    }
  }

  // 重启应用
  const restartApp = async (record: any) => {
    // 如果应用已经是关闭，则不让重启
    if(!record.runStatus) return message.error('当前应用已经关闭，请先开启')
    // 调用重启接口
    const res:any = await startOrStopApp({
      id: `${record.id}`,
      direct: 'restart',
    })
    if(!res.success) {
      return message.error(res.message)
    }
    await getAppData()
    message.success(res.message)
  }

  useEffect(()=>{
    getAppData()
  },[])

  return (
    <>
        <Card
            title="应用管理"
            extra={<>
              <Space>
                <Button type='primary' onClick={getAppData}>刷新</Button>
              </Space>
            </>}
            bordered={false}
        >
            <Table dataSource={dataSource} columns={tableColumns} />
        </Card>
    </>
  )
}

export default Manage