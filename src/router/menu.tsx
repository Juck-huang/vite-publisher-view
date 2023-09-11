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
]

export const getMenuObj = (dataList: Array<any>, resultObj: any) => {
    dataList.forEach((data: any)=>{
        resultObj[data.key] = data
        if (data.children) {
            getMenuObj(data.children, resultObj)
        }
    })
}