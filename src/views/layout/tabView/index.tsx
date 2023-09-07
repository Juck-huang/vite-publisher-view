import { Tabs } from 'antd';
import { withRouter } from "react-router-dom";
import './index.scss'

// 标签组件
const TabView = (props: any) => {
    const { panes, activeKey, handleRemoveTab, handleActiveKey } = props

    // 切换tab时触发
    const onChange = (key: any) => {
        handleActiveKey(key)
        props.history.push(key)
    }

    // 删除tab时触发
    const removeTab = (targetKey: any) => {
        handleRemoveTab(targetKey)
    }
    return (
        <div style={{
            backgroundColor: '#edf0f3',
            height: '31px',
            position: 'relative',
        }}>
             <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={removeTab}
                items={panes}
            />
        </div>
    )
}

export default withRouter(TabView)