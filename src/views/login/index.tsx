import { Form, Input, Button, message as aMessage } from 'antd'
import {
    LockOutlined,
    UserOutlined
  } from '@ant-design/icons'
import { withRouter } from 'react-router'
import { setToken } from '@/utils/auth'
// import {login} from '@/api/login'
import './index.scss'
const { Item } = Form

// 公钥信息

const Login = (props: { history: { replace: (arg0: string) => void } }) => {

    // 登录请求
    const onFinish = (values: { password: any; username: any }) => {
        const loginFrom = {
            username: values.username,
            password: values.password // rsa加密后的密码
        }
        console.log('loginFrom', loginFrom)
        setToken('csdacascdfdfdsfsdxdscd')
        props.history.replace('/dashboard')
        // login(loginFrom).then((res: any) => {
        //     const { success, message, result } = res
        //     if (success) {
        //         aMessage.success('登录成功')
        //         // 存储token到localStorage中
        //         setToken(result.token)
        //         props.history.replace('/dashboard')
        //     } else {
        //         aMessage.error('登录失败:'+ message)
        //     }
        // })
    }

    return (
        <div id="userLayout">
            <div className="login_panel">
                <div className="login_panel_form">
                    <div className="login_panel_form_title">
                        <p className="login_panel_form_title_p">后台管理系统</p>
                    </div>
                    <div className='login-div-form'>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                            }}
                            onFinish={onFinish}
                            size="large"
                            >
                            <Item name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名!',
                                    },
                                ]}>
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
                            </Item>
                            <Item
                                name="password"
                                rules={[
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="请输入密码"
                                />
                            </Item>
                            <Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </Item>
                        </Form>
                    </div>
                </div>
            </div>
            <div className="login_panel_foot">
                <div className="copyright">
                    Copyright 2023
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login)