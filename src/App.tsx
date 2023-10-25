import Router from './router'
import './App.scss'
import 'antd/dist/antd.css'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
import { useState } from 'react'

function App() {
  const [locale] = useState(zhCN)
  return (
    <ConfigProvider locale={locale}>
      <Router/>
    </ConfigProvider>
  )
}

export default App;