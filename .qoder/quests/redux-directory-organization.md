# Redux Toolkit 目录组织设计文档

## 1. 概述

本文档旨在设计一个清晰、可维护的 Redux Toolkit 目录结构，遵循"一个文件一个功能"的原则。通过将 slice 和 saga 分离到独立的文件中，提高代码的模块化程度和可维护性。

## 2. 设计原则

- **单一职责原则**: 每个文件只负责一个特定的功能
- **功能分离**: Slice 负责状态定义和同步操作，Saga 负责异步操作
- **模块化**: 相关功能组织在同一目录下
- **可扩展性**: 易于添加新功能模块

## 3. 目录结构设计

```
src/
├── store/
│   ├── index.ts                 # Store 配置和组合
│   ├── hooks.ts                 # 自定义 Redux hooks
│   ├── counter/                 # 计数器功能模块
│   │   ├── counterSlice.ts      # 计数器状态和同步操作
│   │   └── counterThunks.ts     # 计数器异步操作(使用 Redux Thunk)
│   ├── user/                    # 用户功能模块
│   │   ├── userSlice.ts         # 用户状态和同步操作
│   │   └── userSaga.ts          # 用户异步操作
│   ├── posts/                   # 文章功能模块
│   │   ├── postsSlice.ts        # 文章状态和同步操作
│   │   └── postsSaga.ts         # 文异步操作
│   └── types/                   # 全局类型定义
│       └── index.ts             # 导出所有共享类型
```

## 4. 模块详细设计

### 4.1 Counter 模块

#### 文件结构
```
counter/
├── counterSlice.ts
└── counterThunks.ts
```

#### counterSlice.ts
负责定义计数器的状态结构和同步操作：
- 状态类型定义 (CounterState)
- 初始状态值
- 同步 reducers (increment, decrement, incrementByAmount)
- 导出 action creators
- 导出 reducer

#### counterThunks.ts
负责处理计数器的异步操作：
- 异步 thunk (incrementAsync)
- 与 slice 的 extraReducers 对接

### 4.2 User 模块

#### 文件结构
```
user/
├── userSlice.ts
└── userSaga.ts
```

#### userSlice.ts
负责定义用户的状态结构和同步操作：
- 状态类型定义 (User, UserState)
- 初始状态值
- 同步 reducers (fetchUsers, fetchUsersSuccess, fetchUsersFailure)
- 导出 action creators
- 导出 reducer

#### userSaga.ts
负责处理用户的异步操作：
- API 调用函数 (fetchUsersApi)
- Worker sagas (fetchUsersSaga)
- Watcher sagas (watchFetchUsers)
- Root saga (userSaga)

### 4.3 Posts 模块

#### 文件结构
```
posts/
├── postsSlice.ts
└── postsSaga.ts
```

#### postsSlice.ts
负责定义文章的状态结构和同步操作：
- 状态类型定义 (Post, PostsState)
- 初始状态值
- 同步 reducers (fetchPosts, createPost, deletePost 及其成功/失败状态)
- 导出 action creators
- 导出 reducer

#### postsSaga.ts
负责处理文章的异步操作：
- API 调用函数 (fetchPostsApi, createPostApi, deletePostApi)
- Worker sagas (fetchPostsSaga, createPostSaga, deletePostSaga)
- Watcher sagas (watchFetchPosts, watchCreatePost, watchDeletePost)
- Root saga (postsSaga)

## 5. 类型定义组织

创建独立的类型定义文件，便于跨模块共享：
- 全局类型放在 `store/types/index.ts` 中
- 模块特定类型放在各自模块的 slice 文件中

## 6. Store 配置

在 `store/index.ts` 中：
- 组合所有 reducers
- 配置 middleware (saga, thunk)
- 设置 Redux Persist
- 导出 store 和 persistor
- 启动所有 sagas

## 7. 优势

1. **模块化**: 功能分离使代码更易于理解和维护
2. **可维护性**: 修改某个功能时只需关注对应文件
3. **可扩展性**: 添加新功能时只需新增对应模块目录
4. **团队协作**: 多人开发时减少文件冲突
5. **代码复用**: 类型定义和工具函数可独立导出使用