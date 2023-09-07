import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
  } from '@ant-design/icons'
import { Layout, Dropdown, Avatar } from 'antd'
import './index.scss'
import BreadcrumbView from './breadcrumbView'
import { removeToken } from '@/utils/auth'
import { shallowEqual, useSelector } from 'react-redux'
import * as React from 'react'

const { Header } = Layout


const HeaderView = (props: { collapsedClick?: any; collapsed?: any; currBreadList?: any }) => {

    const { collapsed, currBreadList } = props
    const userSlice = useSelector(
        (state: any) => {
            return {
                name: state.user.name,
                avatar: state.user.avatar
            }
        },
        shallowEqual
    )

    // 登出
    const logout = () =>{
        // 移除本地token并刷新页面
        removeToken()
        window.location.reload()
    }
    // 右上角功能列表
    const items = [
        {
            key: '1',
            label: (<div>修改密码</div>),
        },
        {
          key: '2',
          label: (<div onClick={logout}>登出</div>),
        },
    ]

    return (
        <Header
            className="site-layout-background"
            style={{
                padding: 0,
                height: '65px',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <div className='header-nav'>
                <div className='left-nav'>
                    <div>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => props.collapsedClick(),
                        })}
                    </div>
                    <div>
                        <BreadcrumbView breadList={currBreadList} />
                    </div>
                </div>
                <div className='right-nav'>
                    <span style={{marginRight: '10px'}}>{userSlice.name}</span>
                    <Dropdown
                        menu={{
                            items,
                        }}
                        placement="bottomRight"
                        arrow={{
                            pointAtCenter: true,
                        }}
                        >
                        <Avatar style={{cursor: 'pointer'}} size="large" icon={<UserOutlined />} src={userSlice.avatar} />
                    </Dropdown>
                </div>
            </div>
        </Header>
    )
}

export default HeaderView