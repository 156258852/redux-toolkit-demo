import { call, put, takeEvery, takeLatest, all, fork } from 'redux-saga/effects'
import {
  fetchPosts,
  fetchPostsSuccess,
  fetchPostsFailure,
  createPost,
  createPostSuccess,
  createPostFailure,
  deletePost,
  deletePostSuccess,
  deletePostFailure
} from './postsSlice'
import type { Post } from '../types'

// 模拟 API 调用函数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* fetchPostsApi(): Generator<any, Post[], any> {
  const response: Response = yield call(fetch, 'https://jsonplaceholder.typicode.com/posts')
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return yield call([response, 'json'])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* createPostApi(action: { payload: Omit<Post, 'id'> }): Generator<any, Post, any> {
  const response: Response = yield call(fetch, 'https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(action.payload),
  })
  if (!response.ok) {
    throw new Error('Failed to create post')
  }
  return yield call([response, 'json'])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* deletePostApi(action: { payload: number }): Generator<any, boolean, any> {
  const response: Response = yield call(fetch, `https://jsonplaceholder.typicode.com/posts/${action.payload}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete post')
  }
  return true
}

// Worker sagas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* fetchPostsSaga(): Generator<any, void, any> {
  try {
    const posts: Post[] = yield call(fetchPostsApi)
    yield put(fetchPostsSuccess(posts))
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(fetchPostsFailure(error.message))
    } else {
      yield put(fetchPostsFailure('An unknown error occurred'))
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* createPostSaga(action: ReturnType<typeof createPost>): Generator<any, void, any> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post: Post = yield call(createPostApi as any, action)
    yield put(createPostSuccess(post))
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(createPostFailure(error.message))
    } else {
      yield put(createPostFailure('An unknown error occurred'))
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* deletePostSaga(action: ReturnType<typeof deletePost>): Generator<any, void, any> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yield call(deletePostApi as any, action)
    yield put(deletePostSuccess(action.payload))
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(deletePostFailure(error.message))
    } else {
      yield put(deletePostFailure('An unknown error occurred'))
    }
  }
}

// Watcher sagas
function* watchFetchPosts() {
  yield takeLatest(fetchPosts.type, fetchPostsSaga)
}

function* watchCreatePost() {
  yield takeEvery(createPost.type, createPostSaga)
}

function* watchDeletePost() {
  yield takeEvery(deletePost.type, deletePostSaga)
}

const postsSagas = [
  watchFetchPosts,
  watchCreatePost,
  watchDeletePost,
]

// Root saga
// 使用 fork 并行启动所有 watcher sagas
export function* postsSaga() {
  yield all(postsSagas.map(saga => fork(saga)))
}
