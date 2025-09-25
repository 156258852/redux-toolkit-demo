/**
 * Redux-Saga API 演示文件
 * 展示各种 Redux-Saga API 的用法和作用
 */

import { call, put, takeEvery, takeLatest, all, fork, take, delay } from 'redux-saga/effects'
import { createAction, createSlice } from '@reduxjs/toolkit'

// ==================== 1. 演示用的 Action 和 State ====================

// 定义演示用的 action
const demoActions = {
  // takeEvery 相关
  triggerTakeEvery: createAction<number>('sagaDemo/triggerTakeEvery'),
  takeEveryResult: createAction<string>('sagaDemo/takeEveryResult'),

  // takeLatest 相关
  triggerTakeLatest: createAction<number>('sagaDemo/triggerTakeLatest'),
  takeLatestResult: createAction<string>('sagaDemo/takeLatestResult'),

  // take 相关
  triggerTake: createAction<void>('sagaDemo/triggerTake'),
  takeResult: createAction<string>('sagaDemo/takeResult'),

  // select 相关
  triggerSelect: createAction<void>('sagaDemo/triggerSelect'),
  selectResult: createAction<string>('sagaDemo/selectResult'),

  // race 相关
  triggerRace: createAction<void>('sagaDemo/triggerRace'),
  raceResult: createAction<string>('sagaDemo/raceResult'),

  // all 相关
  triggerAll: createAction<void>('sagaDemo/triggerAll'),
  allResult: createAction<string>('sagaDemo/allResult'),
}

// 定义 state 类型
interface SagaDemoState {
  takeEveryResults: string[]
  takeLatestResults: string[]
  takeResults: string[]
  selectResults: string[]
  raceResults: string[]
  allResults: string[]
  counter: number
}

// 初始状态
const initialState: SagaDemoState = {
  takeEveryResults: [],
  takeLatestResults: [],
  takeResults: [],
  selectResults: [],
  raceResults: [],
  allResults: [],
  counter: 0
}

// 创建 slice
const sagaDemoSlice = createSlice({
  name: 'sagaDemo',
  initialState,
  reducers: {
    incrementCounter: (state) => {
      state.counter += 1
    },
    resetDemo: (state) => {
      state.takeEveryResults = []
      state.takeLatestResults = []
      state.takeResults = []
      state.selectResults = []
      state.raceResults = []
      state.allResults = []
    },
    // 手动添加 actions 作为 reducers
    triggerTakeEvery: () => {
      // 这个 action 由 saga 监听，不需要在这里做任何事情
    },
    takeEveryResult: (state, action) => {
      state.takeEveryResults.push(action.payload)
    },
    triggerTakeLatest: () => {
      // 这个 action 由 saga 监听，不需要在这里做任何事情
    },
    takeLatestResult: (state, action) => {
      state.takeLatestResults.push(action.payload)
    },
    triggerTake: () => {
      // 这个 action 由 saga 监听，不需要在这里做任何事情
    },
    takeResult: (state, action) => {
      state.takeResults.push(action.payload)
    },
    triggerSelect: () => {
      // 这个 action 由 saga 监听，不需要在这里做任何事情
    },
    selectResult: (state, action) => {
      state.selectResults.push(action.payload)
    },
    triggerRace: () => {
      // 这个 action 由 saga 监听，不需要在这里做任何事情
    },
    raceResult: (state, action) => {
      state.raceResults.push(action.payload)
    },
    triggerAll: () => {
      // 这个 action 由 saga 监听，不需要在这里做任何事情
    },
    allResult: (state, action) => {
      state.allResults.push(action.payload)
    }
  }
})

// 导出 actions 和 reducer
export const { incrementCounter, resetDemo } = sagaDemoSlice.actions
export default sagaDemoSlice.reducer

// ==================== 2. 模拟 API 函数 ====================

// 模拟一个异步 API 调用
function* mockApiCall(id: number, delayMs: number = 1000): Generator<unknown, string, unknown> {
  yield delay(delayMs)
  return `API Result for ID: ${id} (delay: ${delayMs}ms)`
}



// ==================== 3. Redux-Saga API 演示 ====================



/**
 * 3. takeEvery API
 * 作用：监听指定的 action，每当 action 被 dispatch 时就执行对应的 saga
 * 特点：可以同时运行多个 saga 实例
 */
function* takeEveryWorker(action: ReturnType<typeof demoActions.triggerTakeEvery>) {
  try {
    console.log(`takeEveryWorker 开始处理 ID: ${action.payload}`)
    const result: string = yield call(mockApiCall, action.payload, 2000)
    yield put(demoActions.takeEveryResult(result))
    console.log(`takeEveryWorker 完成处理 ID: ${action.payload}`)
  } catch (error: unknown) {
    console.error('takeEveryWorker 错误:', error instanceof Error ? error.message : 'Unknown error')
  }
}

function* takeEveryWatcher() {
  yield takeEvery(demoActions.triggerTakeEvery.type, takeEveryWorker)
}

/**
 * 4. takeLatest API
 * 作用：监听指定的 action，当 action 被 dispatch 时执行对应的 saga，但如果之前的 saga 还在运行则会被取消
 * 特点：只保留最新的 saga 实例
 */
function* takeLatestWorker(action: ReturnType<typeof demoActions.triggerTakeLatest>) {
  try {
    console.log(`takeLatestWorker 开始处理 ID: ${action.payload}`)
    // 使用不同的延迟时间来演示 takeLatest 的效果
    const result: string = yield call(mockApiCall, action.payload, 3000 - action.payload * 500)
    yield put(demoActions.takeLatestResult(result))
    console.log(`takeLatestWorker 完成处理 ID: ${action.payload}`)
  } catch (error: unknown) {
    console.error('takeLatestWorker 错误:', error instanceof Error ? error.message : 'Unknown error')
  }
}

function* takeLatestWatcher() {
  yield takeLatest(demoActions.triggerTakeLatest.type, takeLatestWorker)
}

/**
 * 5. take API
 * 作用：等待特定的 action 被 dispatch
 * 特点：阻塞调用，Saga 会暂停直到匹配的 action 被发出
 */
function* takeSaga() {
  console.log('等待 triggerTake action...')
  yield take(demoActions.triggerTake.type)
  const result = "take API 已捕获 action"
  yield put(demoActions.takeResult(result))
  console.log('takeSaga 完成')
}





/**
 * 8. all API
 * 作用：并行运行多个 effects，等待所有 effects 完成
 * 特点：类似于 Promise.all
 */

// ==================== 4. 根 Saga ====================

export function* sagaDemoRootSaga() {
  yield all([
    fork(takeEveryWatcher),
    fork(takeLatestWatcher),
    fork(takeSaga),
    // 其他独立的 sagas 可以在这里添加
  ])
}

// ==================== 5. 使用示例 ====================

/*
使用说明：

1. call(fn, ...args)
   - 用于调用函数，Saga 会等待函数执行完成
   - 示例：const result = yield call(api.fetchUser, userId)

2. put(action)
   - 用于 dispatch 一个 action 到 store
   - 示例：yield put(fetchUserSuccess(user))

3. takeEvery(pattern, saga, ...args)
   - 监听指定的 action，每次 action 被 dispatch 时都执行对应的 saga
   - 可以同时运行多个 saga 实例
   - 示例：yield takeEvery('FETCH_USER', fetchUserSaga)

4. takeLatest(pattern, saga, ...args)
   - 监听指定的 action，当 action 被 dispatch 时执行对应的 saga
   - 如果之前的 saga 还在运行，则会被自动取消
   - 示例：yield takeLatest('FETCH_USER', fetchUserSaga)

5. take(pattern)
   - 等待特定的 action 被 dispatch
   - Saga 会暂停直到匹配的 action 被发出
   - 示例：yield take('LOGIN_SUCCESS')

6. select(selector, ...args)
   - 从 Redux store 中获取 state
   - 示例：const user = yield select(state => state.user)

7. race(effects)
   - 同时运行多个 effects，当其中一个完成或失败时，取消其他 effects
   - 示例：
     const { response, timeout } = yield race({
       response: call(fetch, '/api/data'),
       timeout: delay(5000)
     })

8. all(effects)
   - 并行运行多个 effects，等待所有 effects 完成
   - 示例：
     const [user, posts] = yield all([
       call(fetchUser, userId),
       call(fetchPosts, userId)
     ])

9. fork(fn, ...args)
   - 非阻塞地调用函数
   - 不会等待函数完成，立即继续执行下一行代码
   - 示例：yield fork(backgroundSync)

10. delay(ms)
    - 延迟指定毫秒数
    - 示例：yield delay(1000) // 延迟 1 秒
*/