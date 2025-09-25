import { createSlice } from '@reduxjs/toolkit'
import { incrementAsync } from './counterThunks'

// 定义 CounterState 类型
export interface CounterState {
  value: number
  // 为不同的操作分离 loading 状态
  incrementLoading: boolean
  decrementLoading: boolean
  incrementByAmountLoading: boolean
  asyncIncrementLoading: boolean
  // 为不同的操作分离 error 状态
  incrementError: string | null
  decrementError: string | null
  incrementByAmountError: string | null
  asyncIncrementError: string | null
}

// 初始状态
const initialState: CounterState = {
  value: 0,
  incrementLoading: false,
  decrementLoading: false,
  incrementByAmountLoading: false,
  asyncIncrementLoading: false,
  incrementError: null,
  decrementError: null,
  incrementByAmountError: null,
  asyncIncrementError: null,
}

// 创建 slice
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit 允许我们在 reducers 中直接"修改"状态
      state.value += 1
      state.incrementLoading = true
      state.incrementError = null
    },
    decrement: (state) => {
      state.value -= 1
      state.decrementLoading = true
      state.decrementError = null
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
      state.incrementByAmountLoading = true
      state.incrementByAmountError = null
    },
  },
  // 处理异步操作的结果
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.asyncIncrementLoading = true
        state.asyncIncrementError = null
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.asyncIncrementLoading = false
        state.value += action.payload
      })
      .addCase(incrementAsync.rejected, (state, action) => {
        state.asyncIncrementLoading = false
        state.asyncIncrementError = action.error.message || 'Failed to increment'
      })
  },
})

// 导出同步 action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions

// 导出 reducer
export default counterSlice.reducer