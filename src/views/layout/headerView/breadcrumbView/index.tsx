import { Breadcrumb } from 'antd';
import { NavLink } from 'react-router-dom'

const { Item } = Breadcrumb


const BreadcrumbView = (props: any) => {
    // 面包屑列表
    const { breadList } = props

    return (
        <Breadcrumb>
            { breadList.map((bread: any, index: number) => {
                if (bread.path) {
                    return <Item key={index}><NavLink to={bread.path}>{bread.name}</NavLink></Item>
                } else {
                    return <Item key={index}>{bread.name}</Item>
                }
            }) }
        </Breadcrumb>
    )
}

export default BreadcrumbView