import React, { useContext, useRef, useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react'
import { Space, Table, Tag, Breadcrumb,Button, Popconfirm,
      Dropdown, message as msg, message, Modal } from 'antd'
import { 
    HomeOutlined,
    FolderAddOutlined,
    FileAddOutlined,
    FolderOutlined,
    FileOutlined,
    DownOutlined,
    DeleteOutlined,
} from '@ant-design/icons'
import './index.scss'
import FileUploadModal from './fileUploadModal'
import FileEditModal from './fileEditModal'
import { RemoveProjectFile, GetProjectFileList } from '@/api/fileManage'
import { FileContext } from '../fileContext'
import AddFolder from './addFolder'
import AddFile from './addFile'
import RenameFileOrFolder from './renameFileOrFolder'
import { ColumnsType } from 'antd/es/table'
import { getToken } from '@/utils/auth'
import MoveFileOrFolder from './moveFileOrFolder'

const FileList = forwardRef((props:any, ref) => {
    
    const { 
      isModalEditOpen,
    } = props
    const [isModalFileOpen, setIsModalFileOpen] = useState(false) // 是否打开上传文件模态框
    const [isModalAddFolder, setIsModalAddFolder] = useState(false) // 新增文件夹模态框
    const [isModalMoveFileOrFolder, setModalMoveFileOrFolder] = useState(false) // 移动文件或文件夹模态框
    const [isModalAddFile, setIsModalAddFile] = useState(false) // 新增文件模态框
    const [isModalRenameFile, setIsModalRenameFile] = useState(false) // 重命名文件/文件夹模态框
    const [showButton, setShowButton] = useState(false) // 显示顶部按钮
    const [uploadPath, setUploadPath] = useState('') // 上传文件路径
    const [currClickFileName, setCurrClickFileName] = useState('') // 当前点击的文件名
    const breadRef:any = useRef() // 监听面包屑容器
    const [tableSelectedRowKeys, setTableSelectedRowKeys] = useState<React.Key[]>([]) // 表格已选择的keys
    const [openDelteModal, setOpenDelteModal] = useState(false) // 打开删除确认框
    // 面包屑数据
    const [breadcrumbList, setBreadcrumbList] = useState<any[]>([])
    // 右侧表格数据 
    const [tableData, setTableData] = useState([])
  
    const { 
      handleFileEdit,
      projectIdRef,
      projectEnvIdRef, 
      projectTypeIdRef,
      // currEditFile,
      handleLoading
    }:any = useContext(FileContext)
    // 右侧表格列
    const [tableColumns, 
      // setTableColumns
    ] = useState<ColumnsType<[]>>([
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 380,
            render: (_:any, record:any) => 
                <span style={{
                    cursor: 'pointer',
                    color: 'blue'
                }}
                onClick={()=> {handleFileClick(record.key, record.type)}}
                >
                    {
                        record.type === 'folder' ? (<FolderOutlined style={{marginRight: '5px'}} />): <FileOutlined style={{marginRight: '5px', color:'green'}} />
                    }
                    <span style={{color: record.type === 'folder' ? '': 'green'}}>
                        {record.name}
                    </span>
                </span>
        },
        {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: '修改日期',
            dataIndex: 'updateDate',
            key: 'updateDate',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (_:any, record:any)=> {
                return (
                    <Tag color={record.type==='folder'? 'geekblue': 'green'} key={record.type}>
                        {record.type==='folder'?'文件夹':'文件'}
                    </Tag>
                )
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 230,
            align: 'center',
            render: (_:any, record:any) => {
              const items = [
                  {
                    key: 'delete',
                    label: (
                        <Popconfirm
                            title='删除操作不可逆，确认删除吗？'
                            onConfirm={()=>{deleteFile(record)}}
                            // onCancel={handleDeleteCancel}
                            okText='确认'
                            cancelText='取消'
                        >
                            <div style={{cursor: 'pointer', color: 'black', fontSize: 12}}>删除</div>
                        </Popconfirm>
                    )
                  },
                  {
                    key: 'rename',
                    label: <div style={{cursor: 'pointer', color: 'black', fontSize: 12}} onClick={()=>{handleRenameFile(record)}}>重命名</div>
                  }
              ]
              // 可编辑的文件扩展名列表
              const editExtNames = ['txt', 'yaml', 'yml', 'sh', 'json', 'log']
              if (record.type === 'file' && editExtNames.includes(record.extName)){
                // 支持编辑功能
                items.push({
                    key: 'edit',
                    label: (<div style={{cursor: 'pointer', color: 'black', fontSize: 12}} onClick={()=>{handleFileEdit(true, record)}}>编辑</div>)
                })
              }
              if (record.type === 'file' && record.extName === 'zip') {
                // 如果是zip文件，则支持解压功能
                items.push({
                    key: 'unzip',
                    label: (<div style={{cursor: 'pointer', color: 'black', fontSize: 12}}>解压</div>)
                })
              }
              if (record.type === 'folder') {
                  // 文件夹支持压缩成zip文件
                  items.push({
                    key: 'zip',
                    label: <div style={{cursor: 'pointer', color: 'black', fontSize: 12}}>压缩</div>
                  })
              }
              if (record.type === 'file') {
                  // 文件才支持下载
                  items.push({
                    key: 'download',
                    label: (<div style={{cursor: 'pointer', color: 'black', fontSize: 12}} onClick={()=>{downloadFile(record.key)}}>下载</div>)
                  })
              }
              return (
                <Space size="small">
                    <span style={{cursor: 'pointer', color: 'blue', fontSize: 12}} onClick={() => handleMove(record)}>移动</span>
                    <span style={{cursor: 'pointer', color: 'blue', fontSize: 12}} onClick={() => handleCopy(record)}>复制</span>
                    {
                        items.length ? (
                            <Dropdown menu={{items}}>
                                <Space style={{cursor: 'pointer', color: 'blue', fontSize: 12}}>
                                    更多
                                    <DownOutlined />
                                </Space>
                            </Dropdown>
                        ): <></>
                    }
                </Space>
              )
            }
        },
    ])

    // 处理移动文件或文件夹
    const handleMove = (record: any) => {
        setModalMoveFileOrFolder(true)
        setCurrClickFileName(record.name)
    }

    // 处理复制文件或文件夹
    const handleCopy = (record: any) => {
        console.log('copy:', record)
    }

    const clearBread = useCallback(() => {
        setBreadcrumbList([])
    },[])
  
    // 处理打开文件模态框
    const handleOpenFileModal = (value:boolean) => {  
      setIsModalFileOpen(value)
    }
  
    const openFileModal = () => {
      // 设置上传文件路径,取面包屑最后一个对象的key即可
      setUploadPath(breadcrumbList.length ? breadcrumbList.slice(-1)[0]?.key: '/')
      handleOpenFileModal(true)
    }
  
    // 获取文件列表
    const getFileList = useCallback(async (params:any)=> {
      const { success, result }: any = await GetProjectFileList(params)
      if (success) {
          result.forEach((item:any) => {
              item.key = item.name
          })
          setTableData(result)
          setShowButton(true)
      } else {
        setShowButton(false)
        setTableData([])
      }
    },[])
  
    // 点击文件列表每一行名称后的回调
    const handleFileClick = (value:any, fileType:string) => {
      // console.log('handleFileClick', value)
      // 如果是文件则不添加到面包屑
      if (fileType === 'file') return
      // 添加值到面包屑数组
      setBreadcrumbList(item => {
          const newBread = [
              ...item,
              {
                  name: value,
                  key: [...item.map((a:any) => a.name),value].join('/')
              }
          ]
          const params = {
              projectId: projectIdRef.current,
              projectEnvId: projectEnvIdRef.current,
              projectTypeId: projectTypeIdRef.current,
              pathName: newBread.map((a:any) => a.name).join('/')
          }
          getFileList(params)
          return newBread
      })
    }
  
    // 下载文件
    const downloadFile = async (key:any) => {
      handleLoading(true)
      const pathName = breadRef.current.length ? `${breadRef.current.slice(-1)[0].key}/${key}` : key
      const projectId = projectIdRef.current
      const projectEnvId = projectEnvIdRef.current
      const projectTypeId = projectTypeIdRef.current
      
      // 使用iframe下载，支持暂停
      let downloadPrefix = import.meta.env.MODE === 'production'?'/aps-web':'/api'
      const url = `${downloadPrefix}/rest/fileManager/getProjectFile?token=${getToken()}&projectId=${projectId}&projectEnvId=${projectEnvId}&projectTypeId=${projectTypeId}&pathName=${pathName}`
      let iframe:any = document.createElement('iframe')
      iframe.src = url
      iframe.id= 'myIframe'
      iframe.style.display = 'none'
      iframe.onload = () => {
          document.body.removeAttribute(iframe)
      }
      document.body.appendChild(iframe)
      setTimeout(() => {
        const myIframe:any = document.getElementById('myIframe')
        const myIframeBody = myIframe?.contentDocument.body
        const preDatas = myIframeBody.getElementsByTagName('pre')
        if (preDatas.length) {
            // 说明返回的是错误信息
            const innerHTML = preDatas[0]?.innerHTML
            if (innerHTML) {
                const res = JSON.parse(innerHTML)
                if (!res.success) msg.error('下载文件失败:'+res.msg)
            }
        }
        //n毫秒后销毁iframe
        iframe.src = "about:blank"
        iframe.parentNode.removeChild(iframe)
      }, 500)

      handleLoading(false)
    }
  
    // 点击面包屑后的处理
    const handleBreadcrumbClick = (value:string) => {
      // console.log('Breadcrumb click value:', value)
      // 移除面包屑数组多余的值
      setBreadcrumbList(item => {
          // 根据当前点击的key找到对应面包屑中的位置，然后移除该key对应数组后面的所有元素
          const i = item.findIndex((bread:any) => bread.key === value)
          const newBread = item.slice(0, i+1)
          const params = {
              projectId: projectIdRef.current,
              projectEnvId: projectEnvIdRef.current,
              projectTypeId: projectTypeIdRef.current,
              pathName: newBread.map((a:any) => a.name).join('/')
          }
          getFileList(params)
          return newBread
      })
    }

    const handleFolderModalOpen = (value:any) => {
        setIsModalAddFolder(value)
    }

    // 删除项目文件或文件夹
    const deleteFile = async (val:any) => {
        const params = {
            projectId: projectIdRef.current,
            projectEnvId: projectEnvIdRef.current,
            projectTypeId: projectTypeIdRef.current,
            pathName: breadRef.current.slice(-1)[0] ? `${breadRef.current.slice(-1)[0].key}/${val.key}` : `${val.key}`
        }
        const res:any = await RemoveProjectFile(params)
        if (res.success) {
            message.success(res.message)
            params.pathName =  `${breadRef.current.slice(-1)[0]?.key || ''}`
            getFileList(params)
        } else {
            message.error(res.message)
        }
    }

    const handleRenameFile = (value:any) => {
        setIsModalRenameFile(true)
        setCurrClickFileName(value.name)
    }

    // 表格勾选后的回调
    const tableOnSelectChange = (newSelectedRowKeys: React.Key[]) => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys)
        setTableSelectedRowKeys(newSelectedRowKeys)
    }

    const rowSelection = {
        selectedRowKeys: tableSelectedRowKeys,
        onChange: tableOnSelectChange,
    }

    // 提交勾选删除
    const submitDeleteChecked = () =>{
        // console.log('tableSelectedRowKeys', tableSelectedRowKeys)
        setOpenDelteModal(false)
    }

    // 暴露组件方法给父组件调用
    useImperativeHandle(ref,
        () => ({getFileList,clearBread}),
        [getFileList, clearBread]
    )
  
    useEffect(()=>{
        breadRef.current = breadcrumbList
        // console.log('tableSelectedRowKeys', tableSelectedRowKeys)
        setTableSelectedRowKeys([]) // 清空已经选择的keys
    },[breadcrumbList])

    return (
      <>
        <div className='container-main'>
            <div className='file-div'>文件列表</div>  
            <div className='file-header-div'>
                <Breadcrumb style={{
                    margin: '5px',
                    width: '550px',
                }}>
                    <Breadcrumb.Item onClick={()=>{handleBreadcrumbClick('')}}>
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    {
                        breadcrumbList.map((breadcrumb:any)=>(
                            <Breadcrumb.Item key={breadcrumb.key} onClick={()=>{handleBreadcrumbClick(breadcrumb.key)}}>
                                <span style={{cursor: 'pointer'}}>{breadcrumb.name}</span>
                            </Breadcrumb.Item>
                        ))
                    }
                </Breadcrumb>
                <div className='button-div' style={{ width: 400}}>
                    {
                        showButton ? (
                            <>
                                {/* 删除勾选按钮动态展示，当前有一个及以上勾选时展示 */}
                                {
                                    tableSelectedRowKeys.length ? <Button type="primary" size='small' icon={<DeleteOutlined />} onClick={()=>setOpenDelteModal(true)}  style={{marginRight: 5}}>删除勾选</Button>: <></>
                                }
                                <Button type="primary" size='small' 
                                    icon={<FolderAddOutlined />} 
                                    style={{marginRight: 5}}
                                    onClick={()=>{setIsModalAddFolder(true)}}
                                >新建文件夹</Button>
                                <Button type="primary" size='small'
                                    icon={<FileAddOutlined />}
                                    style={{marginRight: 5}}
                                    onClick={()=>{setIsModalAddFile(true)}}
                                >新建文件</Button>
                                <Button type="primary" size='small' icon={<FileAddOutlined />} onClick={openFileModal}  style={{marginRight: 15}}>文件上传</Button>
                            </>
                        ) : <></>
                    }
                </div>
            </div>
            
            <Table 
                locale={{emptyText: '暂无数据'}}
                rowSelection={rowSelection}
                columns={tableColumns}
                dataSource={tableData}
                pagination={false}
                scroll={{
                  y: 622,
                }}
            />
        </div>
  
        {
           // 上传文件对话框
           isModalFileOpen ? (
              <FileUploadModal 
                  isModalFileOpen={isModalFileOpen} 
                  handleOpenFileModal={handleOpenFileModal}
                  uploadPath={uploadPath}
                  getFileList={getFileList}
              />
           ) : <></>
        }
        {
           // 文件编辑对话框
           isModalEditOpen ? (
            <FileEditModal
                isModalEditOpen={isModalEditOpen}
                filePath={breadcrumbList.length ? breadcrumbList.slice(-1)[0]?.key: '/'}
            />
           ) : <></>
        }
        {
            // 新增文件夹对话框
           isModalAddFolder ? (
               <AddFolder 
                isModalAddFolder={isModalAddFolder} 
                handleFolderModalOpen={handleFolderModalOpen}
                breadcrumbList={breadcrumbList}
                getFileList={getFileList}
               />
           ) : <></>
        }
        {
            // 新增文件对话框
           isModalAddFile ? (
               <AddFile
                isModalAddFile={isModalAddFile}
                handleFileModalOpen={(value:any)=>{setIsModalAddFile(value)}}
                breadcrumbList={breadcrumbList}
                getFileList={getFileList}
               />
           ) : <></>
        }
        {
           // 重命名文件/文件夹对话框
           isModalRenameFile ? (
               <RenameFileOrFolder
                isModalRenameFile={isModalRenameFile}
                handleRenameFileModalOpen={(value:any)=>{setIsModalRenameFile(value)}}
                breadcrumbList={breadcrumbList}
                getFileList={getFileList}
                currClickFileName={currClickFileName}
               />
           ) : <></>
        }
        {
           <Modal
            title="提示"
            open={openDelteModal}
            onCancel={()=>setOpenDelteModal(false)}
            maskClosable={false}
            onOk={submitDeleteChecked}
            okText="确认"
            cancelText="取消"
          >
            <h4>确认删除选中文件/文件夹? <span style={{color: 'red'}}>(注意，删除操作不可逆!!!)</span></h4>
           </Modal>
        }
        {
           isModalMoveFileOrFolder ? (
                <MoveFileOrFolder
                    isModalMoveFileOrFolder={isModalMoveFileOrFolder} 
                    handleModalMoveFileOrFolderOpen={setModalMoveFileOrFolder}
                    breadcrumbList={breadcrumbList}
                    getFileList={getFileList}
                    currClickFileName={currClickFileName}
                />
           ): <></>
        }
      </>
    )
  })

export default FileList