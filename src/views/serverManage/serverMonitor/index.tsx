import { Card, Space, Button, Select } from 'antd'
import * as echarts from 'echarts'
import { useEffect, useState } from 'react'


 // 项目环境组件 
 const ServerMonitor = () => {
  const [tableData,setTableData] = useState<any[]>([]) // 表格数据
  const [projectOptions, setProjectOptions] = useState([]) // 项目下列框
  const [selectProjectId, setSelectProjectId] = useState<number>() // 选中的项目id
  
  // 处理搜索
  const handleSearch = (selectPId:any) => {
    if (!selectPId) {
      console.log(tableData)
      return
    }
    const filterData = tableData.filter((item:any) => item.projectId === selectPId)
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

  const initEcharts = () => {
    const myChart = echarts.init(document.getElementById('echarts-div'))
    // 指定图表的配置项和数据
    const option = {
      title: {
        text: 'Cpu使用率'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          data: [420, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }

  useEffect(()=>{
    const data:any[] = [
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
    data.forEach((item:any) =>{
      if (!projectObj[item.projectId]) {
        projectObj[item.projectId] = item.projectName
      }
    })
    for (let key in projectObj) {
      projectData.push({label: projectObj[key], value: Number(key)})
    }
    setProjectOptions(projectData)
    initEcharts()
  },[])

  return (
    <>
      <Card title="项目环境" size='small'>
        <Space size='small' align='center' style={{marginBottom: 10 }}>
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
        </Space>
        <div id="echarts-div" style={{width: 700,height: 400}}></div>
      </Card>
    </>
  )
}

export default ServerMonitor