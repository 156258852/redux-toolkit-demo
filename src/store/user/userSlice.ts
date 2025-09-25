import { createSlice } from '@reduxjs/toolkit'
import type { User } from '../types'

// 定义 UserState 类型
export interface UserState {
  users: User[]
  // 为不同的操作分离 loading 状态
  fetchLoading: boolean
  // 为不同的操作分离 error 状态
  fetchError: string | null
}

// 初始状态
const initialState: UserState = {
  users: [],
  fetchLoading: false,
  fetchError: null,
}

// 创建 slice
export const userSlice = createSlice({
  name: '@@app/user',
  initialState,
  reducers: {
    // 这些是组件会 dispatch 的 actions
    fetchUsers: (state) => {
      console.log('fetchUsers')
      state.fetchLoading = true
      state.fetchError = null
    },

    // 这些是由 sagas dispatch 的 actions
    fetchUsersSuccess: (state, action) => {
      console.log('fetchUsersSuccess')
      state.fetchLoading = false
      state.users = action.payload
    },

    fetchUsersFailure: (state, action) => {
      console.log('fetchUsersFailure')
      state.fetchLoading = false
      state.fetchError = action.payload
    },
  },
})

// 导出 action creators
export const { fetchUsers, fetchUsersSuccess, fetchUsersFailure } = userSlice.actions

// 导出 reducer
export default userSlice.reducer