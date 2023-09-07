import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import LayoutView from "@/views/layout"
import { getToken } from '@/utils/auth'
import Login from "@/views/login"
import { setUserInfo } from '@/store/features/userSlice'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { GetUserInfo } from '@/api/user'

const Router = () => {
    const dispatch = useDispatch()
    const idSlice = useSelector(
        (state: any) => {
            return {
                id: state.user.id
            }
        },
        shallowEqual
    )
    
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route
                    path="/"
                    render={() => {
                        // 如果没有token，则直接跳转到登录页面
                        if (!getToken()) {
                            return <Redirect to="/login" />
                        } else {
                            // 有token，说明已经登录过，则直接从redux中取出当前登录用户的id，如果存在则直接返回主页，否则调用redux发送请求获取
                            // 请求成功后再跳转到主页，请求失败则跳转到登录页
                            if (idSlice.id) {
                                return <LayoutView />   
                            } else {
                                console.log('不存在用户id,准备发送请求获取')
                                GetUserInfo({}).then((res)=> {
                                    dispatch(setUserInfo(res.data.result))
                                    return <LayoutView />
                                }).catch(() =>{
                                    return <Redirect to="/login" />
                                })
                            }
                        }
                    }}
                />
                </Switch>
        </HashRouter>
    )
}

export default Router