import { call, put, takeEvery, all, fork } from 'redux-saga/effects'
import { fetchUsers, fetchUsersSuccess, fetchUsersFailure } from './userSlice'
import type { User } from '../types'

// 模拟 API 调用
function apiCall(): Promise<User[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      const users: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
      ]
      resolve(users)
    }, 1000)
  })
}

// Worker saga
function* fetchUsersSaga() {
  console.log('Fetching users...')
  try {
    const users: User[] = yield call(apiCall)
    yield put(fetchUsersSuccess(users))
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    yield put(fetchUsersFailure(errorMessage))
  }
}

// Watcher saga
function* watchFetchUsers() {
  console.log('Watching for fetchUsers action...')
  yield takeEvery(fetchUsers.type, fetchUsersSaga)
}

// Root saga
export function* userSaga() {
  console.log('Starting userSaga...')
  yield all([
    fork(watchFetchUsers)
  ])
}