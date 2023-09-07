import { Layout } from 'antd'
import { Route, Switch } from "react-router-dom"
import Dashboard from '@/views/dashboard'

const { Content } = Layout;

const ContentView = () => {
    return (
        <Content
            className="site-layout-background"
            style={{
                margin: '16px 16px 16px',
                overflow: 'auto',
            }}
        >
            <div
                className="site-layout-background"
                style={{
                    // padding: 24,
                    maxHeight: 260,
                }}
            >
                <Switch>
                    <Route exact path='/dashboard' component={Dashboard}/>
                </Switch>
            </div>
        </Content>
    )
}

export default ContentView