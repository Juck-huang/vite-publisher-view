import { useContext, useRef, useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react'
import { Space, Table, Tag, Breadcrumb,Button, Popconfirm,
      Dropdown, message as msg, message } from 'antd'
import { 
    HomeOutlined,
    FolderAddOutlined,
    FileAddOutlined,
    FolderOutlined,
    FileOutlined,
    DownOutlined,
} from '@ant-design/icons'
import './index.scss'
import FileUploadModal from './fileUploadModal'
import FileEditModal from './fileEditModal'
import { DownloadProjectFile, RemoveProjectFile, GetProjectFileList } from '@/api/fileManage'
import { FileContext } from '../fileContext'
import AddFolder from './addFolder'
import AddFile from './addFile'
import RenameFileOrFolder from './renameFileOrFolder'
import { ColumnsType } from 'antd/es/table'

const FileList = forwardRef((props:any, ref) => {
    
    const { 
      isModalEditOpen,
    } = props
    const [isModalFileOpen, setIsModalFileOpen] = useState(false) // 是否打开上传文件模态框
    const [isModalAddFolder, setIsModalAddFolder] = useState(false) // 新增文件夹模态框
    const [isModalAddFile, setIsModalAddFile] = useState(false) // 新增文件模态框
    const [isModalRenameFile, setIsModalRenameFile] = useState(false) // 重命名文件/文件夹模态框
    const [showButton, setShowButton] = useState(false) // 显示顶部按钮
    const [uploadPath, setUploadPath] = useState('') // 上传文件路径
    const [currClickFileName, setCurrClickFileName] = useState('') // 当前点击的文件名
    const breadRef:any = useRef() // 监听面包屑容器
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
    } = useContext(FileContext)
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
              if (record.type === 'file' && (record.extName === 'txt' || record.extName === 'yml')) {
                // 如果是txt,yaml文件则支持编辑功能
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
                    <span style={{cursor: 'pointer', color: 'blue', fontSize: 12}}>移动</span>
                    <span style={{cursor: 'pointer', color: 'blue', fontSize: 12}}>复制</span>
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

    const clearBread = useCallback(() => {
        setBreadcrumbList([])
    },[])
  
    // 处理打开文件模态框
    const handleOpenFileModal = (value:boolean) => {  
      setIsModalFileOpen(value)
    }
  
    const openFileModal = () => {
      // 设置上传文件路径,取面包屑最后一个对象的key即可
      setUploadPath(breadcrumbList.length ? breadcrumbList.at(-1)?.key: '/')
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
      // console.log('key', key, breadRef.current.at(-1))
      const pathName = breadRef.current.length ? `${breadRef.current.at(-1).key}/${key}` : key
      const params = {
          projectId: projectIdRef.current,
          projectEnvId: projectEnvIdRef.current,
          projectTypeId: projectTypeIdRef.current,
          pathName
      }
      const res:any = await DownloadProjectFile(params)
      if (res.type === 'application/json') {
          // 说明下载失败
          const file:any = new FileReader()
          file.readAsText(res, 'utf-8')
          file.onload = () => {
              const { success, message } = JSON.parse(file.result)
              if (!success) {
                  msg.error(message)
                  return
              }
          }
      } else if (res.type === 'application/octet-stream') {
          const blob = new Blob([res])
          const blobUrl = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          document.body.appendChild(a)
          a.download = key
          a.href = blobUrl
          a.click()
          document.body.removeChild(a)
      } else {
          msg.error('所选文件或文件夹暂不支持下载')
          return
      }
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
            pathName: breadRef.current.at(-1) ? `${breadRef.current.at(-1).key}/${val.key}` : `${val.key}`
        }
        const res:any = await RemoveProjectFile(params)
        if (res.success) {
            message.success(res.message)
            params.pathName =  `${breadRef.current.at(-1)?.key || ''}`
            getFileList(params)
        } else {
            message.error(res.message)
        }
    }

    const handleRenameFile = (value:any) => {
        setIsModalRenameFile(true)
        setCurrClickFileName(value.name)
    }

    // 暴露组件方法给父组件调用
    useImperativeHandle(ref,
        () => ({getFileList,clearBread}),
        [getFileList, clearBread]
    )
  
    useEffect(()=>{
        breadRef.current = breadcrumbList
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
                filePath={breadcrumbList.length ? breadcrumbList.at(-1)?.key: '/'}
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
      </>
    )
  })

export default FileList