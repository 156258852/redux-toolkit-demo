import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Post } from '../types'

// 定义 PostsState 类型
export interface PostsState {
  posts: Post[]
  loading: boolean
  error: string | null
  currentPost: Post | null
}

// 初始状态
const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  currentPost: null
}

// 创建 slice，只包含简单的 actions
export const postsSlice = createSlice({
  name: '@@app/posts',
  initialState,
  reducers: {
    // 获取所有文章 - 组件只调用这个
    fetchPosts: (state) => {
      state.loading = true
      state.error = null
    },

    // 获取文章成功 - 由 saga 调用
    fetchPostsSuccess: (state, action) => {
      state.loading = false
      state.posts = action.payload
    },

    // 获取文章失败 - 由 saga 调用
    fetchPostsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // 创建文章 - 组件只调用这个
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createPost: (state, action: PayloadAction<Omit<Post, 'id'>>) => {
      state.loading = true
      state.error = null
    },

    // 创建文章成功 - 由 saga 调用
    createPostSuccess: (state, action) => {
      state.loading = false
      state.posts.push(action.payload)
    },

    // 创建文章失败 - 由 saga 调用
    createPostFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // 删除文章 - 组件只调用这个
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deletePost: (state, action: PayloadAction<number>) => {
      state.loading = true
      state.error = null
    },

    // 删除文章成功 - 由 saga 调用
    deletePostSuccess: (state, action) => {
      state.loading = false
      state.posts = state.posts.filter(post => post.id !== action.payload)
    },

    // 删除文章失败 - 由 saga 调用
    deletePostFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    }
  }
})

// 导出 actions
export const {
  fetchPosts,
  fetchPostsSuccess,
  fetchPostsFailure,
  createPost,
  createPostSuccess,
  createPostFailure,
  deletePost,
  deletePostSuccess,
  deletePostFailure
} = postsSlice.actions

// 导出 reducer
export default postsSlice.reducer