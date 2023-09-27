import { Modal, Select, Space } from 'antd'
import { useState } from 'react'
import ExcelJS from 'exceljs'

// 导出执行结果
const ExportExecResult = (props:any) => {

  const {execResultOpen, handleExecResultOpen, datas, columns} = props
  const [selectType, setSelectType] = useState('') // 选择的类型
  const [typeOption] = useState([
      {
          value: 'json',
          label: 'json格式'
      },
      {
          value: 'excel',
          label: 'excel表格'
      },
      {
          value: 'txt',
          label: 'txt格式'
      }
  ])

  const handleModalCancel = () => {
    handleExecResultOpen(false)
  }

  // 数字转字符串
  const numToString = (num:any) => {
        const char:any[] = []
        char.length = 0
        const numToStringAction = function(num:number){
            const numT:any = num - 1;
            const a = numT / 26
            const b:any = numT % 26
            char.push(String.fromCharCode(64 + parseInt(b+1)))
            if(a>0){
                numToStringAction(a)
            }
        }
        numToStringAction(num);
        return char.reverse().join("")
    }

  const exportExecl = (columnDatas:[], dataList:[]) => {
    const workbook = new ExcelJS.Workbook()
    const workSheet:ExcelJS.Worksheet = workbook.addWorksheet('执行结果', {
        pageSetup:{paperSize: 9, orientation:'landscape'}
    })
    // 填充标题数据
    const rowTitle = workSheet.getRow(1)
    rowTitle.height = 30
    columnDatas.forEach((column:any, index) => {
        workSheet.getCell(`${numToString(index+1)}1`).value = column.title
        workSheet.getCell(`${numToString(index+1)}1`).alignment = {
            vertical: 'middle',
            horizontal: 'left',
        }
        workSheet.getCell(`${numToString(index+1)}1`).font = {
            name: '宋体', size: 13
        }
    })

    // 填充主数据
    dataList.forEach((content, rowIndex) => {
        const rowContent:ExcelJS.Row = workSheet.getRow(2+rowIndex)
        rowContent.height = 20
        const tempContent = JSON.parse(JSON.stringify(content))
        delete tempContent.key
        Object.values(tempContent).forEach((temp:any, index)=>{
            workSheet.getCell(`${numToString(index+1)}${rowIndex+2}`).value = temp
            workSheet.getCell(`${numToString(index+1)}${rowIndex+2}`).alignment = {
                vertical: 'middle',
                horizontal: 'left',
            }
        })
    })
    
    workbook.xlsx.writeBuffer().then((buffer)=>{
        // 将二进制数据转换为Blob对象
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        // 创建下载链接
        const downloadUrl = URL.createObjectURL(blob)
         // 创建a标签并设置下载链接
        const a = document.createElement('a')
        a.href = downloadUrl
        a.download = 'file.xlsx'
        // 模拟点击a标签进行下载
        a.click()
        // 释放下载链接
        URL.revokeObjectURL(downloadUrl)
    })
  }

  const handleModalOk = () => {
    // console.log('selectType', selectType, datas, columns)
    switch(selectType){
    case 'excel':
        console.log('aaa', selectType)
        exportExecl(columns, datas)
        break
    default:
        console.error('选择不支持')
    }
    handleExecResultOpen(false)
  }

  const handleSelectTypeChange = (value:any) => {
    setSelectType(value)
  }

  return (
    <>
        <Modal
        title='导出执行结果'
        open={execResultOpen}
        onOk={handleModalOk}
        okText='导出'
        cancelText="取消"
        onCancel={handleModalCancel}
        okButtonProps={
          {
            // disabled: loading
          }
        }
      >
        <Space>
            选择导出类型：
                <Select
                    style={{
                        width: 130,
                    }}
                    showSearch
                    onChange={handleSelectTypeChange}
                    allowClear
                    options={typeOption}
                    placeholder='请选择导出类型'
                    filterOption={(input, option:any)=>{
                      return option.label.indexOf(input) !== -1
                    }}
                />
        </Space>
      </Modal>
    </>
  )
}

export default ExportExecResult
