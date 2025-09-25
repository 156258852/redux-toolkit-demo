import { configureStore, combineReducers } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import counterReducer from './counter/counterSlice'
import userReducer from './user/userSlice'
import postsReducer from './posts/postsSlice'
import { userSaga } from './user/userSaga'
import { postsSaga } from './posts/postsSaga'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// 导出 selectors
export { selectFilteredUsers, selectStatistics } from './selectors'

// 创建 saga middleware
const sagaMiddleware = createSagaMiddleware()

// 配置持久化选项
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // 我们不希望持久化用户数据和文章数据，因为它们可以从服务器获取
  blacklist: ['user', 'posts']
}

// 创建根 reducer
const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  posts: postsReducer,
})

// 创建持久化 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware),
})

// 运行 sagas
sagaMiddleware.run(userSaga)
sagaMiddleware.run(postsSaga)

export const persistor = persistStore(store)



// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>


// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

