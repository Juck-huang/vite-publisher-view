import { Layout } from 'antd'
import { Route, Switch } from "react-router-dom"
import Dashboard from '@/views/dashboard'
import Release from '@/views/application/release'
import Manage from '@/views/application/manage'
import Database from '@/views/database'
import FileManager from '@/views/fileManager'
import ProjectList from '@/views/projectManage/projectList'
import ServerList from '@/views/serverManage/serverList'
import ServerMonitor from '@/views/serverManage/serverMonitor'
import ProjectEnv from '@/views/projectManage/projectEnv'
import ProjectType from '@/views/projectManage/projectType'

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
                    <Route path='/projectManage/projectList' component={ProjectList}/>
                    <Route path='/projectManage/projectEnv' component={ProjectEnv}/>
                    <Route path='/projectManage/projectType' component={ProjectType}/>
                    <Route path='/serverManage/serverList' component={ServerList}/>
                    <Route path='/serverManage/serverMonitor' component={ServerMonitor}/>
                    <Route component={Dashboard} />
                </Switch>
            </div>
        </Content>
    )
}

export default ContentView