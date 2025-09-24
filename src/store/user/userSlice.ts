import { createSlice } from '@reduxjs/toolkit'
import type { User } from '../types'

// 定义 UserState 类型
export interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}

// 初始状态
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
}

// 创建 slice
export const userSlice = createSlice({
  name: '@@app/user',
  initialState,
  reducers: {
    // 这些是组件会 dispatch 的 actions
    fetchUsers: (state) => {
      console.log('fetchUsers')
      state.loading = true
      state.error = null
    },
    
    // 这些是由 sagas dispatch 的 actions
    fetchUsersSuccess: (state, action) => {
      console.log('fetchUsersSuccess')
      state.loading = false
      state.users = action.payload
    },
    
    fetchUsersFailure: (state, action) => {
      console.log('fetchUsersFailure')
      state.loading = false
      state.error = action.payload
    },
  },
})

// 导出 action creators
export const { fetchUsers, fetchUsersSuccess, fetchUsersFailure } = userSlice.actions

// 导出 reducer
export default userSlice.reducer