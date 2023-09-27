import { useState } from 'react'
import { 
  Modal,
  Space,
  Select,
  Switch,
  message,
} from 'antd'
import { exportOrBakUpDatabase, singleExportTables } from '@/api/database'

// 导出或备份数据库组件
const ExportOrBakUpDb = (props:any) => {

  const {
    exportOrBakUpDbModalOpen,
    handleExportOrBakUpDbClick,
    dbTableOption,
    modalType,
    loading,
    handleLoading,
  } = props

  // useEffect(()=>{
  // },[])

  // 已选择的数据库
  const [selectDb, setSelectDb] = useState('')
  const [selectTables, setSelectTables] = useState(Array)
  // 导出全部表,默认为是
  const [exportAllTable, setExportAllTable] = useState(true)
  // 选择指定表
  const [selectAssignTable, setSelectAssignTable] = useState(false)

  // 选择db后的回调
  const handleSelectDbChange = (value:string) => {
    setSelectDb(value)// 设置选择db后的数据
    // 如果选择了忽略表则使忽略表置空
    if (selectTables.length) {
      setSelectTables([])
    }
  }
  // 点击导出按钮的回调
  const handleModalOk = () => {
    // 如果未选择数据库则先不让导出
    if (!selectDb) {
      message.error('请先选择数据库')
      return
    }
    // 如果选择了不导出全部表后,未勾选导出指定表并且未选择排除表也不让导出
    if (!exportAllTable && !selectAssignTable && !selectTables.length) {
      message.error('请至少选择一个需要排除的表')
      return
    }
    // 如果选择了不导出全部表后,勾选导出指定表并且未选择指定表也不让导出
    if (!exportAllTable && selectAssignTable && !selectTables.length) {
      message.error('请至少选择一个需要导出的表')
      return
    }
    handleExportOrBakUpDbClick(false) // 关闭对话框
    handleLoading(true) // 打开加载框
    // 导出指定表
    if (selectAssignTable) {
      singleExportTables({
        dbName: selectDb,
        exportTables: selectTables,
      }).then((res:any)=>{
        if (res.type === 'application/zip') {
          const blob = new Blob([res], {type: 'application/octet-stream'})
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `${selectDb}.zip`
          link.click()
        } else if (res.type === 'application/json') {
          message.error('导出数据失败')
        } else {
          if (res.success) {
            message.success(res.message)
          } else {
            message.error(res.message)
          }
        }
        handleLoading(false)
      })
    } else {
      // 导出除了排除表外全部表
      exportOrBakUpDatabase({
        dbName: selectDb,
        ignoreTables: selectTables,
        type: modalType // type为1代表备份，为2代表的是导出数据库
      }, modalType === 2 ?'blob': 'json').then((res:any)=>{
        if (res.type === 'application/zip') {
          const blob = new Blob([res], {type: 'application/octet-stream'})
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `${selectDb}.zip`
          link.click()
        } else if (res.type === 'application/json') {
          message.error('导出或备份数据失败')
        } else {
          if (res.success) {
            message.success(res.message)
          } else {
            message.error(res.message)
          }
        }
        handleLoading(false)
      })
    }
  }
  // 处理点击了取消
  const handleModalCancel = () => {
    handleExportOrBakUpDbClick(false)
  }
  // 是否导出全部表
  const onChangeSelectAll = (value:any) => {
    // 选择了否之后会先判断是否选择数据库，选择了后再请求接口获取当前数据库对应的所有表
    if (!selectDb) {
      message.error('请先选择数据库')
      return
    }
    setExportAllTable(value)
  }
  // 处理已选择的表
  const handleTableSelectChange = (value:any) => {
    // console.log(`selected ${value}`, ignoreTables) 
    setSelectTables([...value])
  }

  return (
    <>
      <Modal
        title={modalType === 1 ?'备份数据库': '导出数据库'}
        open={exportOrBakUpDbModalOpen}
        onOk={handleModalOk}
        okText={modalType === 1 ?'备份': '导出'}
        cancelText="取消"
        onCancel={handleModalCancel}
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
        <Space style={{marginLeft: 15}}>
            {modalType === 1 ?'备份全部表:': '导出全部表:'}
            <Switch defaultChecked disabled={selectDb ? false : true} onChange={onChangeSelectAll} />
        </Space>
        <br/>
        <br/>
        {/* // 选择了不导出或备份全部表后，出现下列的字段项去勾选不需要导出的表 */}
        {
        !exportAllTable ? (
          <>
            {/* 选择了导出指定表后，先判断是否勾选了导出指定表，勾选了则会出现导出表选项表，然后提交重新调用新的接口（rest/database/single/export）单独导出表
              未勾选，则校验是否选择了排除表调用原接口
            */}
            {
              modalType === 2 ? (<Space>
                导出指定表:
                <Switch 
                  style={{marginLeft: 10}} 
                  onChange={(value)=>{setSelectAssignTable(value)}} 
                />
              </Space>): (<></>)
            }

            {/* 排除表或导出表 */}
            <Space 
                style={{
                  marginTop: modalType === 2 ? 15: 0,
                }}>{selectAssignTable ? '指定表：': '排除表：'}
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: 380,
                    marginLeft: 28,
                  }}
                  placeholder={selectAssignTable ? '请选择指定表': '请选择排除表'}
                  value={selectTables}
                  onChange={handleTableSelectChange}
                  options={dbTableOption[selectDb].map((table:any)=>({
                    label: table,
                    value: table,
                  }))}
                />
            </Space>
          </>
          ): (<></>)
        }
      </Modal>
    </>
  )
}

export default ExportOrBakUpDb