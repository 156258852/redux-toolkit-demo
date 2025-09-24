import { createSlice } from '@reduxjs/toolkit'
import { incrementAsync } from './counterThunks'

// 定义 CounterState 类型
export interface CounterState {
  value: number
  loading: boolean
  error: string | null
}

// 初始状态
const initialState: CounterState = {
  value: 0,
  loading: false,
  error: null,
}

// 创建 slice
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit 允许我们在 reducers 中直接"修改"状态
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
  // 处理异步操作的结果
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.loading = false
        state.value += action.payload
      })
      .addCase(incrementAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to increment'
      })
  },
})

// 导出同步 action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions

// 导出 reducer
export default counterSlice.reducer