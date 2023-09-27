import { NavLink } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'

// 菜单列表
export const menuList: Array<any> = [
        {
            key: '/dashboard',
            label: <NavLink to='/dashboard'>主页</NavLink>,
            icon: <HomeOutlined />,
            id: 1,
            level: 1,
        },
        {
            key: '/application',
            label: '发布管理',
            id: 2,
            level: 1,
            children: [
                {
                    key: '/application/release',
                    label: <NavLink to='/application/release'>应用发布</NavLink>,
                    id: 3,
                    parentid: 2,
                    level: 2,
                },
                {
                    key: '/application/manage',
                    label: <NavLink to='/application/manage'>应用管理</NavLink>,
                    id: 4,
                    parentid: 2,
                    level: 2
                }
            ]
        },
        {
            key: '/database',
            label: <NavLink to='/database'>数据库管理</NavLink>,
            id: 6,
            level: 1,
        },
        {
            key: '/fileManager',
            label: <NavLink to='/fileManager'>文件管理</NavLink>,
            id: 7,
            level: 1,
        },
]

export const getMenuObj = (dataList: Array<any>, resultObj: any) => {
    dataList.forEach((data: any)=>{
        resultObj[data.key] = data
        if (data.children) {
            getMenuObj(data.children, resultObj)
        }
    })
}