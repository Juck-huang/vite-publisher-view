import {
    Select,
    Upload,
    Form,
    Button,
    message,
    TreeSelect,
    UploadFile,
    notification,
} from 'antd'
import { InboxOutlined }  from '@ant-design/icons';
import { useEffect, useState } from 'react'
import { releaseProject } from '../../../api/publish'
import { GetProjectList } from '../../../api/project/project'
import './index.scss'
import { GetProjectEnvList } from '../../../api/project/projectEnv'
import { GetProjectTypeList } from '../../../api/project/projectType'
const { Dragger } = Upload

// 发布组件
const Release = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]) // 上传文件列表
    const [uploading, setUploading] = useState(false) // 正在上传状态
    const [projectId, setProjectId] = useState('') // 项目id
    const [projectList, setProjectList] = useState([]) // 项目列表
    const [projectEnvId, setProjectEnvId] = useState(null) // 项目环境id
    const [projectEnvList, setProjectEnvList] = useState([]) // 项目环境列表
    const [projectTypeId, setProjectTypeId] = useState('') // 项目类型id
    const [projectTypeList, setProjectTypeList] = useState([]) // 项目类型树形列表
    const [projectEnvMap, setProjectEnvMap] = useState(Object) // 项目环境映射列表
    const [projectTypeMap, setProjectTypeMap] = useState(Object)
    const [form] = Form.useForm()
  
    useEffect(()=>{
        getProjectList()
    },[])

    // 获取项目列表
    const getProjectList = () => {
        GetProjectList({}).then((res:any)=>{
            const projects = res.result.map((item:any)=>{
                return {
                    id: item.id,
                    label: item.name
                }
            })
            setProjectList(projects)
        }).catch(err=>{
            console.error('err', err)
        })
    }

    // 通过项目id获取项目环境列表
    const getProjectEnvList = (value:string) => {
        let envList: [] = projectEnvMap[value]
        if (envList) {
            // console.log('从缓存中获取项目环境列表', envList, value)
            setProjectEnvList([...envList])
            return
        }
        GetProjectEnvList({
            projectId: value
        }).then((res: any)=>{
            const mapResult: [] = res.result.map((item: any) => ({id: item.id, label: item.name}))
            setProjectEnvMap({...projectEnvMap, [value]: mapResult})
            setProjectEnvList([...mapResult])
        }).catch(err=>{
            console.error(err)
        })
    }

    // 通过项目id获取项目类型列表
    const getProjectTypeList = (value: any) => {
        let typeList: [] = projectTypeMap[value]
        if (typeList) {
            // console.log('从缓存中获取项目类型列表', typeList, value)
            setProjectTypeList([...typeList])
            return
        }
        GetProjectTypeList({
            projectId: value
        }).then((res:any)=>{
            const resultList = buildTreeList(res.result)
            setProjectTypeList(resultList)
            setProjectTypeMap({...projectTypeMap, [value]: resultList})
        }).catch(err=>{
            console.error(err)
        })
    }

    // 构造树数据
    const buildTreeList = (dataList: []) => {
        // 过滤出来没有父id的数据
        let rootList = dataList.filter((src: any)=>{
            return !src.parentId
        })
        rootList.forEach((result:any)=>{
            result.title = result.name
            result.value = result.id
            result.selectable = false
            getTreeList(dataList, result)
        })
        return rootList
    }

    // 递归获取列表
    const getTreeList = (srcList:[], currNode: any) => {
        const node = srcList.filter((item:any)=>{
            return item.parentId === currNode.id
        })
        if (!currNode.isLeaf) {
            currNode.children = node
            currNode.children.forEach((item:any)=>{
                item.title = item.name
                item.value = item.id
                if (!item.isLeaf) {
                    item.selectable = false
                }
                getTreeList(srcList, item)
            })
        }
    }

    // 上传文件
    const handleUploadFile = (uploadFileList: any,data:any) => {
        const formData = new FormData()
        formData.append('file',uploadFileList[0].originFileObj)
        formData.append('projectId',data.projectId)
        formData.append('envId', data.envId)
        formData.append('typeId', data.typeId)

        setUploading(true)
        releaseProject(formData).then((res: any)=>{
            if (res.success) {
                message.success('发布成功')
                console.log(uploadFileList[0]?.originFileObj)
                notification.success({
                    message: `发布成功`,
                    description: `发布${uploadFileList[0]?.originFileObj.name}成功`,
                    duration: 10,
                })
            } else {
                message.error('发布失败:'+res.message)
                notification.error({
                    message: '发布失败',
                    description: '发布失败',
                    duration: 30,
                })
            }
            form.setFieldValue('projectId', undefined)// 重置项目id
            form.setFieldValue('projectEnvId', undefined) // 重置项目环境id
            form.setFieldValue('projectTypeId', undefined) // 重置项目类型id
            setFileList([])
        }).catch(err=>{
            console.error('服务器异常', err)
            message.error('服务器异常:'+err)
            notification.error({
                message: '发布失败',
                description: '发布失败',
                duration: 30,
            })
        }).finally(()=>{
            setUploading(false)
        })
    }
  
    // 表单提交操作
    const onFinish = () => {
        if (!fileList.length) {
            message.error('请先上传项目文件')
            return
        }
        const params = {
            envId: projectEnvId,
            projectId: projectId,
            typeId: projectTypeId
        }
        handleUploadFile(fileList, params)
    }
  
    // 上传之前
    const beforeUpload = (file: any) =>{
        setFileList([...fileList, file])
        return false
    }
  
    //  移除文件
    const onRemove = (file:any) => {
        const index = fileList.indexOf(file)
        const newFileList = fileList.slice()
        newFileList.splice(index, 1);
        setFileList([...newFileList])
    }
  
    // 文件有变化时
    const onChange = (file:any) =>{
        setFileList(file.fileList)
    }
  
    // 选择项目后的回调
    const handleProjectChange = (value:any) => {
        setProjectId(value)
        getProjectEnvList(value)
        getProjectTypeList(value)
        form.setFieldValue('projectEnvId', undefined)
        form.setFieldValue('projectTypeId', undefined)
    }
  
    // 选择了项目环境后的回调
    const handleProjectEnvChange = (value:any) => {
        setProjectEnvId(value)
    }

    // 选择了项目类型后的回调
    const handleProjectTypeChange = (value:any) => {
        setProjectTypeId(value)
    }

    return (
        <>
            <div className="container">
                    <div className='header-div'>
                            <h2>项目发布</h2>
                            <span>步骤一:依次选择需要发布的项目、环境和类型, 步骤二:上传项目文件(前端请上传zip文件，后端上传jar文件),步骤三:点击发布</span>
                    </div>
                    <div className="main-div">
                        <Form
                            labelCol={{
                                span: 4,
                            }}
                            wrapperCol={{
                                span: 8,
                            }}
                            form={form}
                            layout="horizontal"
                            onFinish={onFinish}
                        >
                            <Form.Item 
                                label="项目名称" 
                                name="projectId"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择项目',
                                    },
                                ]}>
                                <Select 
                                    allowClear
                                    placeholder="请选择项目" 
                                    onChange={handleProjectChange}  
                                    // value={projectId}
                                    options={projectList.map((project:any) => ({
                                        label: project.label,
                                        value: project.id
                                    }))}
                                    />
                            </Form.Item>
                
                            <Form.Item 
                                label="项目环境"
                                name="projectEnvId"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择项目环境',
                                    },
                                ]}>
                                <Select 
                                    allowClear
                                    placeholder="请选择项目环境" 
                                    onChange={handleProjectEnvChange}  
                                    // value={projectEnvId}
                                    options={
                                        projectEnvList.map((projectEnv:any) => ({
                                            label: projectEnv.label,
                                            value: projectEnv.id
                                        }))
                                    }
                                />
                            </Form.Item>
                            <Form.Item 
                                label="项目类型"
                                name="projectTypeId"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择项目类型',
                                    },
                                ]}>
                                <TreeSelect
                                    style={{
                                        width: '100%',
                                    }}
                                    allowClear
                                    placeholder="请选择项目类型" 
                                    value={projectTypeId}
                                    dropdownStyle={{
                                        maxHeight: 400,
                                        overflow: 'auto',
                                    }}
                                    treeData={projectTypeList}
                                    onChange={handleProjectTypeChange}
                                    />
                            </Form.Item>
                
                            <Form.Item 
                                label="项目文件"
                                valuePropName="fileList"
                                >
                                {/* <Upload
                                    fileList={fileList}
                                    beforeUpload={beforeUpload} 
                                    onRemove={onRemove}
                                    onChange={onChange}
                                    maxCount={1}>
                                    <Button>点击上传</Button>
                                </Upload> */}
                                <Dragger
                                    name='file'
                                    fileList={fileList}
                                    beforeUpload = {beforeUpload}
                                    onChange= {onChange}
                                    onRemove={onRemove}
                                    maxCount={1}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">拖拽或者点击上传项目文件</p>
                                    <p className="ant-upload-hint">
                                        仅支持单项目文件上传
                                    </p>
                                </Dragger>
                            </Form.Item>
                            <Form.Item label="发布">
                                <Button
                                    disabled={fileList.length === 0}
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={uploading}>
                                    {uploading ? '正在上传' : '提交'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
            </div>
        </>
      )
}

export default Release