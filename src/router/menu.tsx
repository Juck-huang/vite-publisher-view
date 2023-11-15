import { NavLink } from 'react-router-dom'
import { 
    HomeOutlined, 
    AppstoreAddOutlined,
    DatabaseOutlined,
    ProfileOutlined,
    // CloudServerOutlined,
    // ProjectOutlined,
 } from '@ant-design/icons'

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
            label: '应用管理',
            icon: <AppstoreAddOutlined />,
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
            icon: <DatabaseOutlined />,
            level: 1,
        },
        {
            key: '/fileManager',
            label: <NavLink to='/fileManager'>文件管理</NavLink>,
            id: 7,
            icon: <ProfileOutlined />,
            level: 1,
        },
        // {
        //     key: '/serverManage',
        //     label: '服务器管理',
        //     id: 8,
        //     icon: <CloudServerOutlined />,
        //     level: 1,
        //     children: [
        //         {
        //             key: '/serverManage/serverList',
        //             label: <NavLink to='/serverManage/serverList'>服务器列表</NavLink>,
        //             id: 9,
        //             parentid:8,
        //             level: 2,
        //         },
        //         {
        //             key: '/serverManage/serverMonitor',
        //             label: <NavLink to='/serverManage/serverMonitor'>服务器监控</NavLink>,
        //             id: 10,
        //             parentid: 8,
        //             level: 2
        //         }
        //     ]
        // },
        // {
        //     key: '/projectManage',
        //     label: '项目管理',
        //     id: 11,
        //     icon: <ProjectOutlined />,
        //     level: 1,
        //     children: [
        //         {
        //             key: '/projectManage/projectList',
        //             label: <NavLink to='/projectManage/projectList'>项目列表</NavLink>,
        //             id: 12,
        //             parentid: 11,
        //             level: 2,
        //         },
        //         {
        //             key: '/projectManage/projectEnv',
        //             label: <NavLink to='/projectManage/projectEnv'>项目环境</NavLink>,
        //             id: 13,
        //             parentid: 11,
        //             level: 2
        //         },
        //         {
        //             key: '/projectManage/projectType',
        //             label: <NavLink to='/projectManage/projectType'>项目类型</NavLink>,
        //             id: 14,
        //             parentid: 11,
        //             level: 2
        //         }
        //     ]
        // },
]

// 获取菜单对象
export const getMenuObj = (dataList: Array<any>, resultObj: any) => {
    dataList.forEach((data: any)=>{
        resultObj[data.key] = data
        if (data.children) {
            getMenuObj(data.children, resultObj)
        }
    })
}