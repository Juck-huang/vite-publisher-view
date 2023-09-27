import { Layout } from 'antd'
import { Route, Switch } from "react-router-dom"
import Dashboard from '@/views/dashboard'
import Release from '@/views/application/release'
import Manage from '@/views/application/manage'
import Database from '@/views/database'
import FileManager from '@/views/fileManager'

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
                    <Route path='/application/manage' component={Manage}/>
                    <Route path='/application/release' component={Release}/>
                    <Route path='/database' component={Database}/>
                    <Route path='/fileManager' component={FileManager}/>
                </Switch>
            </div>
        </Content>
    )
}

export default ContentView