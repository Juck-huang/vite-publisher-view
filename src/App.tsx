import Router from './router'
import './App.scss'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
import { useState } from 'react'
import "antd/dist/antd.css"

function App() {
  const [locale] = useState(zhCN)
  return (
    <ConfigProvider locale={locale}>
      <Router/>
    </ConfigProvider>
  )
}

export default App;