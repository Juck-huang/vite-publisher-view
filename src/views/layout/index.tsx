import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { withRouter,useLocation } from "react-router-dom"
import './index.scss'
import TabView from './tabView'
import SiderView from './siderView'
import HeaderView from './headerView'
import ContentView from './contentView'
import { menuList, getMenuObj } from '@/router/menu'


// 主样式组件
 const LayoutView = (props: { history: { replace: (arg0: string) => void; push: (arg0: string) => void } }) => {
    const location = useLocation()
    // 当前展开的菜单的key列表
    const [currOpenKey, setCurrOpenKey] = useState()
    useEffect(()=>{
        const initFunc = () =>{
            if (location.pathname === '/') {
                props.history.replace('/dashboard')
                handleOpenKeys('/dashboard')
                return
            }
            // 处理左侧菜单点击
            menuClick(location.pathname)
            handleOpenKeys(location.pathname)
        }
        initFunc()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[location.pathname])
    // 一级默认可点击,二级默认是当前选中菜单的父节点不可点击,三级默认是当前选中节点可点击,选一级就只显示一级为主页,二三级为最后两级
    const [collapsed, setCollapsed] = useState(false)
    const [currBreads, setCurrBreads] = useState([])
    const [panes, setPanes] = useState([
        {
            label: '主页',
            key: '/dashboard',
        }
    ])
    
    const [activeKey, setActiveKey] = useState()
    
    // 折叠打开左侧bar
    const collapsedClick = () => {
        setCollapsed(!collapsed)
    }

    // 点击左侧菜单对应的回调
    const menuClick = (key: string) => {
        const keyObj: any = {}
        let resultList: any = []
        getMenuObj(menuList, keyObj)
        // 不是根路径再去匹配
        if (key !== '/' && keyObj[key]) {
            const {level} = keyObj[key]
            if (level === 1) {
                const {children, to } = keyObj[key].label.props
                resultList.push({name:  children, path: to, level: 1})
                addOrSelectTab(children, to)
            } else if (level > 1) {
                const res:any = Object.values(keyObj).find((item: any) => {
                    return item.id === keyObj[key].parentid
                })
                resultList.push({name: '主页', path: '/dashboard'})
                resultList.push({name:  res.label})
                resultList.push({name: keyObj[key].label.props.children})
                addOrSelectTab(keyObj[key].label.props.children, keyObj[key].label.props.to)
            }else {
                console.log('未匹配到任何面包屑')
            }
        } else if (key !== '/' && !keyObj[key]) {
            props.history.replace('/dashboard')
            handleOpenKeys('/dashboard')
        }
        // 设置当前面包屑的值
        setCurrBreads(resultList)
    }

    // 新增或选中一个tag
    const addOrSelectTab = (name: any, key: any) => {
        // 判断当前key是否已经在面板中,在的话则直接激活,否则新增后再激活
        const exist =panes.some(item=> item.key === key)
        if (!exist) {
            setPanes([
            ...panes,
            {
                label: name,
                key,
            },
            ])
        }
        setActiveKey(key)
    }

    // 移除tab
    const handleRemoveTab = (targetKey: string) =>{
        if (targetKey !== '/dashboard') {
            const targetIndex = panes.findIndex((pane) => pane.key === targetKey);
            const newPanes = panes.filter((pane) => pane.key !== targetKey);
            if (newPanes.length && targetKey === activeKey) {
                const filterPane: any = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
                setActiveKey(filterPane.key)
                props.history.push(filterPane.key)
            }
            setPanes(newPanes)
        }
    }

    const handleOpenKeys = (pathname: string) => {
        const keyObj: any = {}
        const keyList: any = []
        getMenuObj(menuList, keyObj)
        
        const d =  keyObj[pathname]
        if (d && d.parentid) {
            getParentData(keyObj, keyList,d.parentid)
        }
        setCurrOpenKey(keyList)
    }

    // 根据当前节点递归获取其父级数据
    const getParentData = (originObj: object, dataList: Array<any>, parentId: number) => {
        if (!parentId) {
            return
        }
        const p1 = Object.values(originObj).find(item => item.id === parentId)
        dataList.splice(0,0,p1.key)
        if (p1.parentid) {
            getParentData(originObj, dataList, p1.parentid)
        }
    }

    // 处理当前激活的key
    const handleActiveKey = (key: any) =>{
        setActiveKey(key)
    }

    const handleOpenChange = (keys: any) =>{
        setCurrOpenKey(keys)
    }

    return (
        <div className="layout-container">
            <Layout style={{minHeight: '100vh'}}>
                {/* 左侧菜单 */}
                <SiderView collapsed={collapsed} menuClick={menuClick} currentOpenKey={currOpenKey} handleOpenChange={handleOpenChange} />
                {/* 右侧 */}
                <Layout className="site-layout">
                
                    {/* 头部 */}
                    <HeaderView collapsed={collapsed} collapsedClick={collapsedClick} currBreadList={currBreads} />
                    {/* 标签 */}
                    <TabView panes={panes} activeKey={activeKey} handleRemoveTab={handleRemoveTab} handleActiveKey={handleActiveKey} />
                    {/* 动态渲染页面 */}
                    <ContentView />
                </Layout>
            </Layout>
        </div>
    )
}

export default withRouter(LayoutView)