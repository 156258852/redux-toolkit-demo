import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './index'
import type { User } from './types'

// 基础 selectors
const selectUsers = (state: RootState) => state.user.users
const selectPosts = (state: RootState) => state.posts.posts

// Selector: 过滤用户
export const selectFilteredUsers = createSelector(
  [selectUsers, (_, searchTerm: string) => searchTerm],
  (users, searchTerm) => {
    if (!searchTerm) return users
    return users.filter((user: User) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }
)

// Selector: 统计数据
export const selectStatistics = createSelector(
  [selectUsers, selectPosts],
  (users, posts) => {
    return {
      totalUsers: users.length,
      totalPosts: posts.length,
      averagePostsPerUser: users.length ? posts.length / users.length : 0
    }
  }
)