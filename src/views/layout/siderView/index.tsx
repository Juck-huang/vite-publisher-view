import { Layout, Menu } from 'antd'
import { useEffect, useState  } from 'react'
import { useLocation, withRouter } from "react-router-dom"
import { menuList } from '@/router/menu'

const { Sider } = Layout

const SiderView = (props: any) => {
    // 当前选中的key
    const [currentKey, setCurrentKey] = useState('');
    
    const location = useLocation()
    const { collapsed, menuClick, currentOpenKey,handleOpenChange } = props

    useEffect(()=>{
        setCurrentKey(location.pathname)
    },[location.pathname, currentOpenKey])
    
    const handleMenu= (e: any) => {
        setCurrentKey(e.key)
        menuClick(e.key)
    }
    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo" />
            <Menu
                theme="dark"
                mode="inline"
                onClick={handleMenu}
                // defaultSelectedKeys={[currentKey]}
                selectedKeys={[currentKey]}
                // defaultOpenKeys={currentOpenKey}
                openKeys={currentOpenKey}
                onOpenChange={(openKeys)=>{
                    handleOpenChange(openKeys)
                }}
                items={menuList}
            />
        </Sider>
    )
}

export default withRouter(SiderView)