import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'

// 创建一个store
const store = configureStore({
    reducer: {
        user: userReducer
    },
    devTools: true // 生产环境为false，开发环境为true
})

export default store