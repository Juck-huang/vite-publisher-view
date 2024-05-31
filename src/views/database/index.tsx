import { useEffect } from 'react'
import './index.scss'
import { Select,
     Button, 
     message as aMsg, 
     Space, 
     Table,
     Spin,
     Tooltip,
     Card
} from 'antd'
import { useState } from 'react'
import { dynamicExecSql, getDatabaseAndTableList } from '@/api/database'
import ExportOrBakUpDb from './exportOrBakUpDb'
import MyCodeMirror from '@/components/myCodeMirror'
import ExecSqlFile from './execSqlFile'
import { useSelector } from 'react-redux'
import ExportExecResult from './exportExecResult'

// 数据库管理
const Database = () => {
    const [dbOption, setDbOption] = useState(Array)// 数据库下拉框数据
    const [dbTableObj, setDbTableObj] = useState({})// 多数据库及对应表列表对象映射
    const [selectDb, setSelectDb] = useState('')// 已选择的数据库
    const [exportOrBakUpDbModalOpen, setExportOrBakUpDbModalOpen] = useState(false) // 是否打开导出或备份数据库模态框
    const [modalType, setModalType] = useState(2) // 1.代表备份数据库 2.代表导出数据库
    const [areaText, setAreaText] = useState('') // 接收sql输入框的数据
    const [tableColumns, setTableColumns] = useState([]) // 查询的表格的数据列表的列名
    const [tableDatas, setTableDatas] = useState([]) // 查询的表格数据列表
    const [loading, setLoading] = useState(false) // 系统加载中
    const [showExecSqlFile, setShowExecSqlFile] = useState(false) // 展示执行sql文件组件
    const [showExportResultOpen, setShowExportResultOpen] = useState(false) // 导出执行结果组件
    const [currentPage, setCurrentPage] = useState(1) // 当前页
    const userSlice = useSelector((state:any) => state.user)

     // 获取数据库和对应表列表
     const getDbAndTableList = () => {
        getDatabaseAndTableList({}).then((res:any) => {
            const { success, result, message } = res
            if (!success) {
                aMsg.error(message)
                return
            }
            if (success && result) {
                setDbOption(Object.keys(result)) // 设置数据库下拉框数据
                setDbTableObj(result)  // 设置数据库和对应表的数据
            }
        }).catch(err => {
            console.error('获取数据库列表失败', err)
            return
        })
    }
    // 点击执行时的回调
    const handleExec = async (value:any) => {
        // 判断是否选择了数据，如果没有选择则提示请先选择
        if (!selectDb) {
            aMsg.error('请先选择需要操作的数据库')
            return
        }
        if (!areaText) {
            aMsg.error('请输入需要执行的sql语句')
            return
        }
        let tempText = areaText
        // 说明是执行已选中的内容
        if (value) {
            const selection:any = window.getSelection()
            const selectedText = selection.toString()
            if (!selectedText) {
                aMsg.error('请选中需要执行的sql语句')
                return
            }
            tempText = selectedText
        }
        let formatSql = tempText.replace(/`/g, '').trim() // `替换为空
        formatSql = formatSql.replace(/"/g,'"').trim() // 双引号替换为单引号
        const notAffects = ['select', 'SELECT', 'show', 'SHOW', 'desc', 'DESC'] // 除了查询操作，其余返回影响条数
        const findAffect = notAffects.find(affect => formatSql.indexOf(affect) === -1 ? false: true)
        if (!findAffect) {
            if (formatSql.endsWith(';')){
                formatSql += 'select row_count() as AffectRows;'
            } else {
                formatSql += ';select row_count() as AffectRows;'
            }
        }
        setLoading(true)
        dynamicExecSql({
            dbName: selectDb,
            sql: formatSql
        }).then((res:any)=>{
            if (!res.success){
                aMsg.error("执行sql失败: "+res.message)
                // return
            } else {
                aMsg.success("执行sql成功")
            }
            // 空标题列表索引
            let null_title_index_list:any = []
            if (res.result?.title?.length) {
                let columnList = res.result.title.map((item:any, index: number)=>{
                    if (item === "NULL") {
                        null_title_index_list.push(index)
                        return {}
                    } 
                    return {
                        title: item,
                        dataIndex: item,
                        key: item,
                        ellipsis: {
                            showTitle: false
                        },
                        width: 150,
                        align: 'center',
                        render: (text:string) => (
                            <Tooltip placement="topLeft" title={text}>
                                {text}
                            </Tooltip>
                        )
                    }
                })
                columnList = columnList.filter((item:any) => item.title)
                setTableColumns(columnList)
            }
            if (res.result?.content?.length) {
                const dataList = res.result.content.map((item:any, index:any)=>{
                    const obj:any = {
                        key: index,
                    }
                    res.result?.title.forEach((title:any, index:any)=>{
                        obj[title] = item[index].replace(/NULL/g, '').trim() // `替换为空
                    })
                    return obj
                })
                setCurrentPage(1)
                setTableDatas(dataList)
            }
            if (!Object.keys(res.result).length) {
                setTableColumns([])
                setTableDatas([])
            }
            
        }).catch(err=>{
            aMsg.error('执行命令失败'+err)
            console.error(err)
        }).finally(()=>{
            setLoading(false)
        })
        
    }
    // 选择数据库后的回调
    const handleSelectChange = (value:any) => {
        setSelectDb(value)
    }
    // 导出数据库
    const handleDbClick = (value:any) => {
        setModalType(value)
        // 点击导出数据库后弹出导出数据库的对话框页面
        setExportOrBakUpDbModalOpen(true)
    }
    // 处理导出或备份数据库模态框点击了确认
    const handleExportOrBakUpDbClick = (value: boolean) => {
        setExportOrBakUpDbModalOpen(value)
    }

    // 处理等待中
    const handleLoading = (value:any) => {
        setLoading(value)
    }

    // 处理选择了页数
    const handlePageChange = (page:any) =>{
        setCurrentPage(page)
    }

    // 处理点击了导出执行结果
    const handleExecResultOpen = (value:boolean) => {
        setShowExportResultOpen(value)
    }

    useEffect(()=>{
        // 获取数据库和对应表列表
        getDbAndTableList()
    }, [])

    return (
        <>
          <Spin spinning={loading} tip="正在处理中...">
            <Card
              title="数据库管理"
              bordered={false}
            >
              <div className='db-container'>
                    <div className='db-header'>
                        <div className='db-item'>
                            <Space>
                                请选择数据库：
                                    <Select
                                        style={{
                                            width: 130,
                                        }}
                                        showSearch
                                        onChange={handleSelectChange}
                                        allowClear
                                        options={dbOption.map((db)=> ({
                                            label: db,
                                            value: db
                                        }))}
                                        placeholder='选择数据库'
                                        filterOption={(input:any, option:any)=>{
                                            return option.label.indexOf(input) !== -1
                                        }}
                                    />
                                    <Button type="primary" onClick={()=>handleExec(false)}>
                                        执行
                                    </Button>
                                    <Button type="primary" onClick={()=>handleExec(true)}>
                                        执行已选中内容
                                    </Button>
                                    
                            </Space>
                        </div>
                        <div className='db-item'>
                            <Space>
                                {
                                    userSlice.userPrivileges?.find((userPrivilege:any) => userPrivilege.privilegeCode === 'write') ?
                                    (<Button type="primary" onClick={()=> setShowExecSqlFile(true)}>
                                        执行sql文件
                                    </Button>): <></>
                                }
                                {
                                    tableDatas.length ? (
                                        <Button type="primary" onClick={()=>{handleExecResultOpen(true)}}>
                                            导出执行结果
                                        </Button>
                                    ) : <></>
                                }
                                
                                <Button type="primary" onClick={()=>handleDbClick(1)}>
                                    备份数据库
                                </Button>
                                <Button type="primary" onClick={()=>handleDbClick(2)}>
                                    导出数据库
                                </Button>
                            </Space>
                        </div>
                    </div>
                    <div className='db-main'>
                        <Space style={{display: 'block'}}>
                            <MyCodeMirror 
                                codeValue={areaText}
                                setCodeValue={setAreaText}
                                codeType='sql'
                                height='300px'
                            />
                            {/* <TextArea
                                placeholder='请输入sql语句，点击执行获取执行结果'
                                rows={10}
                                onChange={(e) => setAreaText(e.target.value)}
                                value={areaText}
                            /> */}
                            <Table
                                locale={{emptyText: '暂无数据'}}
                                columns={tableColumns}
                                dataSource={tableDatas}
                                pagination={{
                                    current: currentPage,
                                    // pageSize: 20,
                                    onChange: handlePageChange,
                                    total:tableDatas.length,
                                    showTotal: (total)=>(`总共${total}条`),
                                    locale: {items_per_page: '/ 页', jump_to: '跳至', page: '页'},
                                    showQuickJumper: true,
                                    // pageSizeOptions: [20, 100, 1000],
                                }}
                                scroll={{
                                    x: 1300,
                                    y: 320,
                                }}
                                size='small'
                            />
                        </Space>
                    </div>
              </div>
            </Card>
            
                {
                    // 导出或备份数据库模态框
                    exportOrBakUpDbModalOpen ? (<ExportOrBakUpDb
                        exportOrBakUpDbModalOpen={exportOrBakUpDbModalOpen}
                        handleExportOrBakUpDbClick={handleExportOrBakUpDbClick}
                        dbTableOption={dbTableObj}
                        modalType={modalType}
                        loading={loading}
                        handleLoading={handleLoading}
                    />): (<></>)
                }
                {
                    // 执行sql文件组件
                    showExecSqlFile ? (<ExecSqlFile
                        execSqlModalOpen={showExecSqlFile}
                        handleExecSqlModalClick={setShowExecSqlFile}
                        loading={loading}
                        handleLoading={handleLoading}
                        dbTableOption={dbTableObj}
                    />) : (<></>)
                }
                {
                    // 导出执行结果组件
                    showExportResultOpen ? (
                        <ExportExecResult
                            execResultOpen={showExportResultOpen}
                            handleExecResultOpen={handleExecResultOpen}
                            datas={tableDatas}
                            columns={tableColumns}
                        />
                    ) : (<></>)
                }
          </Spin>
        </>
    )
}

export default Database