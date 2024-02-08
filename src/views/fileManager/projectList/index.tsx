import { useCallback, useEffect, useState } from 'react'
import { Input, Tree } from 'antd'
import './index.scss'
import { getProjectList } from '@/api/fileManage'

const { Search } = Input

// 项目列表
const ProjectList = (props:any) => {
    const {handleCurrProjectInfo} = props
    const [treeData, setTreeData] = useState([]) // 树的数据
    const [expandedKeys, setExpandedKeys] = useState([]) // 树展开的key列表
    // const [selectKeys, setSelectKeys] = useState([]) // 选择的key列表

    // 处理选择了树后的回调
    const handSelectTree = (selectedKeys:any[]) => {
      // console.log('selectedKeys', selectedKeys.at(-1))
      const idList = selectedKeys.length ? selectedKeys.slice(-1)[0]?.split('-'): []
      if (!idList.length) return
      const params = {
          projectId: Number(idList[0]),
          projectEnvId: Number(idList[1]),
          projectTypeId: Number(idList[2])
      }
      setCurrProjectInfo(params)
    }

    // 递归获取列表
    const getTreeList = useCallback((srcList:any[], currNode:any, projectEnvKey:any) => {
      const node = srcList.filter(item=>{
          return item.parentId === currNode.id
      })
      if (!currNode.isLeaf) {
          currNode.children = node
          currNode.children.forEach((item:any)=>{
              item.title = item.name
              item.key = `${projectEnvKey}-${item.id}`
              delete item.treeId
              delete item.treeLevel
              if (!item.isLeaf) {
                  item.selectable = false
              }
              getTreeList(srcList, item, projectEnvKey)
          })
      }
    },[])

    // 构造树数据
    const buildTreeList = useCallback((dataList:any[], projectEnvKey:any) => {
      // 过滤出来没有父id的数据
      let rootList = dataList.filter(src=>{
          return !src.parentId
      })
      rootList.forEach(result=>{
          result.title = result.name
          result.key = `${projectEnvKey}-${result.id}`
          result.selectable = false
          delete result.treeId
          delete result.treeLevel
          getTreeList(dataList, result, projectEnvKey)
      })
      return rootList
    },[getTreeList])

    // 获取项目树数据
    const getTreeData = useCallback(async () => {
      const { result }:any = await getProjectList({})
      const { projectList, projectEnvList, projectTypeList } = result
      let dataList:any = []
      // 项目列表
      projectList.forEach((project:any) => {
          project.title = project.name
          project.key = `${project.id}`
          project.selectable = false
          // 对应项目环境列表
          const projectEnvs = projectEnvList.filter((projectEnv:any) => projectEnv.projectId === project.id)
          if(projectEnvs.length) {
              projectEnvs.forEach((projectEnv:any) => {
                  projectEnv.title = projectEnv.name
                  projectEnv.key = `${project.id}-${projectEnv.id}`
                  projectEnv.selectable = false
                  // 项目类型列表
                  const projectTypes = projectTypeList.filter((projectType:any) => projectType.projectId === project.id)
                  if (projectTypes.length) {
                      const projectTypesTemp = JSON.parse(JSON.stringify(projectTypes))
                      projectEnv.children = buildTreeList(projectTypesTemp, projectEnv.key)
                  }
              })
              project.children = projectEnvs
          }
          dataList.push(project)
      })
      setTreeData(dataList)
    },[buildTreeList])

    // 树展开时的操作
    const onExpand = (newExpandedKeys:any) => {
      setExpandedKeys(newExpandedKeys)
    }

    // 设置当前项目信息
    const setCurrProjectInfo = (params:any) => {
      // 每次切换了不同的项目环境后，面包屑需要先清除
      // setBreadcrumbList([])
      // setProjectId(params.projectId)
      // setProjectEnvId(params.projectEnvId)
      // setProjectTypeId(params.projectTypeId)
      handleCurrProjectInfo(params)
      // getTreeData(params)
    }

    useEffect(()=>{
      getTreeData() // 获取树的数据
    },[getTreeData])

    return (
      <>
        <div className='project-container'>
            <div className='project-div'>项目列表</div>
            <Search
                style={{
                    marginBottom: 8,
                }}
                placeholder="请输入内容"
                // onChange={onChange}
            />
            <Tree
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                treeData={treeData}
                onSelect={handSelectTree}
                height={669}
            />
        </div>
      </>
    )
  }
  
  export default ProjectList