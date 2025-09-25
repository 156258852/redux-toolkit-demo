import { createAsyncThunk } from '@reduxjs/toolkit'

// 定义 thunk 名称常量
const THUNK_NAMES = {
  incrementAsync: 'counter/incrementAsync',
}

// 异步 thunk，模拟异步增加操作
export const incrementAsync = createAsyncThunk(
  THUNK_NAMES.incrementAsync,
  async (amount: number) => {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    return amount
  }
)

// 注意：extraReducers 的处理已移至 counterSlice.ts 文件中，以避免循环依赖