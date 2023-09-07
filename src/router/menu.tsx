import { NavLink } from 'react-router-dom'

interface Data {
    key: string
    children?: []
    label?: any
    id?: number
    level?: number
}

// 菜单列表
export const menuList: Array<Data> = [
        {
            key: '/dashboard',
            label: <NavLink to='/dashboard'>主页</NavLink>,
            id: 1,
            level: 1,
        },
]

export const getMenuObj = (dataList: Array<Data>, resultObj: any) => {
    dataList.forEach((data: Data)=>{
        resultObj[data.key] = data
        if (data.children) {
            getMenuObj(data.children, resultObj)
        }
    })
}