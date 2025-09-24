/**
 * Redux-Saga API 演示文件
 * 展示各种 Redux-Saga API 的用法和作用
 */

import { call, put, takeEvery, takeLatest, all, fork, take, select, race, delay } from 'redux-saga/effects'
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
    ...demoActions
  }
})

// 导出 actions 和 reducer
export const { incrementCounter, resetDemo } = sagaDemoSlice.actions
export default sagaDemoSlice.reducer

// ==================== 2. 模拟 API 函数 ====================

// 模拟一个异步 API 调用
function* mockApiCall(id: number, delayMs: number = 1000): Generator<any, string, any> {
  yield delay(delayMs)
  return `API Result for ID: ${id} (delay: ${delayMs}ms)`
}

// 快速 API 调用
function* fastApiCall(): Generator<any, string, any> {
  yield delay(500)
  return "Fast API Result"
}

// 慢速 API 调用
function* slowApiCall(): Generator<any, string, any> {
  yield delay(2000)
  return "Slow API Result"
}

// ==================== 3. Redux-Saga API 演示 ====================

/**
 * 1. call API
 * 作用：用于调用函数，可以是普通函数或返回 Promise 的函数
 * 特点：阻塞调用，Saga 会等待函数执行完成后再继续执行
 */
function* callDemoSaga() {
  try {
    console.log('开始调用 API')
    const result: string = yield call(mockApiCall, 1, 1000)
    console.log('API 调用完成:', result)
  } catch (error) {
    console.error('API 调用失败:', error)
  }
}

/**
 * 2. put API
 * 作用：用于 dispatch 一个 action 到 store
 * 特点：类似于 Redux 中的 dispatch 函数
 */
function* putDemoSaga() {
  yield put(incrementCounter())
  console.log('已发送 incrementCounter action')
}

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
  } catch (error: any) {
    console.error('takeEveryWorker 错误:', error.message)
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
  } catch (error: any) {
    console.error('takeLatestWorker 错误:', error.message)
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
 * 6. select API
 * 作用：从 Redux store 中获取 state
 * 特点：类似于 React-Redux 中的 useSelector 或 store.getState()
 */
function* selectSaga() {
  // 获取整个 state
  const state: SagaDemoState = yield select((state: any) => state.sagaDemo)
  console.log('完整状态:', state)
  
  // 获取特定值
  const counter: number = yield select((state: any) => state.sagaDemo.counter)
  console.log('计数器值:', counter)
  
  const result = `Counter value is ${counter}`
  yield put(demoActions.selectResult(result))
}

/**
 * 7. race API
 * 作用：同时运行多个 effects，当其中一个完成或失败时，取消其他 effects
 * 特点：类似于 Promise.race
 */
function* raceSaga() {
  console.log('开始 race 竞争')
  const result = yield race({
    fast: call(fastApiCall),
    slow: call(slowApiCall)
  })
  
  console.log('race 结果:', result)
  const raceResult = result.fast 
    ? `快速 API 获胜: ${result.fast}` 
    : `慢速 API 获胜: ${result.slow}`
    
  yield put(demoActions.raceResult(raceResult))
}

/**
 * 8. all API
 * 作用：并行运行多个 effects，等待所有 effects 完成
 * 特点：类似于 Promise.all
 */
function* allSaga() {
  console.log('开始并行执行多个任务')
  const results = yield all([
    call(mockApiCall, 1, 500),
    call(mockApiCall, 2, 800),
    call(mockApiCall, 3, 300)
  ])
  
  console.log('所有任务完成:', results)
  const allResult = `All results: ${results.join(', ')}`
  yield put(demoActions.allResult(allResult))
}

/**
 * 9. fork API
 * 作用：非阻塞地调用 saga
 * 特点：不会等待 saga 完成，立即继续执行下一行代码
 */
function* forkWorker(name: string) {
  console.log(`forkWorker ${name} 开始`)
  yield delay(2000)
  console.log(`forkWorker ${name} 完成`)
}

function* forkSaga() {
  console.log('开始 fork 演示')
  // 非阻塞调用 - 不会等待完成
  yield fork(forkWorker, 'A')
  yield fork(forkWorker, 'B')
  console.log('fork 调用已完成（但工作可能仍在运行）')
  
  // 为了演示效果，等待一段时间
  yield delay(2500)
}

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