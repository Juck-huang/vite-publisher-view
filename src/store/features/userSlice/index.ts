import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GetUserInfo } from '@/api/user'

// 异步获取用户信息
export const getUserInfoAsync = createAsyncThunk('getUserInfo/async', async ()=> {
    const res = await GetUserInfo({})
    return res
})

const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        id: '',
        name: '',
        avatar: '',
        userPrivileges: []
    },
    reducers: {
        setUserInfo: (state, { payload }) => {
            state.id = payload.id
            state.name = payload.name
            state.avatar = payload.avatar
            state.userPrivileges = payload.userPrivileges
        }
    },
    // 额外的 reducer 执行异步操作
    extraReducers: (builder) => {
        builder.addCase(getUserInfoAsync.pending,state=>{
            // console.log('getUserInfoAsync 执行中还未有结果')
        })
        .addCase(getUserInfoAsync.fulfilled,(state, { payload })=>{
            // console.log('getUserInfoAsync 拿到结果了')
            state.id = payload.result.id
            state.name = payload.result.name
            state.avatar = payload.result.avatar
            state.userPrivileges = payload.result.userPrivileges
        })
        .addCase(getUserInfoAsync.rejected,(state, action)=>{
            console.log('getUserInfoAsync错误')
        })
    }
})

export const { setUserInfo } = userSlice.actions
export default userSlice.reducer