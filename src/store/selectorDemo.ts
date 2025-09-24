/**
 * createSelector 演示文件
 * 展示如何从不同作用域获取 state 并进行计算
 */

import { createSelector } from '@reduxjs/toolkit'

// ==================== 1. 模拟的 State 结构 ====================

// 不同的命名空间/模块
interface UserModule {
  list: User[]
  currentUserId: number | null
}

interface DepartmentModule {
  list: Department[]
}

interface PostModule {
  list: Post[]
}

interface UIModule {
  searchTerm: string
  filters: {
    departmentId: number | null
  }
}

// 根状态 - 包含不同的命名空间
interface RootState {
  userModule: UserModule
  departmentModule: DepartmentModule
  postModule: PostModule
  ui: UIModule
}

interface User {
  id: number
  name: string
  departmentId: number
}

interface Department {
  id: number
  name: string
}

interface Post {
  id: number
  title: string
  authorId: number
}

// ==================== 2. 基础 Selector (从不同命名空间获取数据) ====================

// 从不同命名空间获取数据的 input selectors
const selectUsers = (state: RootState) => state.userModule.list
const selectDepartments = (state: RootState) => state.departmentModule.list
const selectPosts = (state: RootState) => state.postModule.list
const selectCurrentUserId = (state: RootState) => state.userModule.currentUserId
const selectSearchTerm = (state: RootState) => state.ui.searchTerm
const selectDepartmentFilter = (state: RootState) => state.ui.filters.departmentId

// ==================== 3. 使用 createSelector 组合不同作用域的数据 ====================

/**
 * 1. 组合不同命名空间的数据
 * 从 users 和 departments 命名空间获取数据并组合
 */
const selectUsersWithDepartments = createSelector(
  [selectUsers, selectDepartments],
  (users, departments) => {
    return users.map(user => {
      const department = departments.find(dept => dept.id === user.departmentId)
      return {
        ...user,
        departmentName: department ? department.name : 'Unknown'
      }
    })
  }
)

/**
 * 2. 获取当前用户信息
 * 结合 currentUserId 和 users 数据（跨命名空间）
 */
const selectCurrentUserDetails = createSelector(
  [selectUsers, selectCurrentUserId],
  (users, currentUserId) => {
    if (!currentUserId) return null
    return users.find(user => user.id === currentUserId) || null
  }
)

/**
 * 3. 获取用户及其发布的文章
 * 组合 userModule 和 postModule 命名空间的数据
 */
const selectCurrentUserWithPosts = createSelector(
  [selectCurrentUserDetails, selectPosts],
  (currentUser, posts) => {
    if (!currentUser) return null
    
    const userPosts = posts.filter(post => post.authorId === currentUser.id)
    
    return {
      ...currentUser,
      posts: userPosts
    }
  }
)

/**
 * 4. 搜索功能
 * 组合多个作用域的数据并根据搜索词过滤
 */
const selectFilteredUsersWithPosts = createSelector(
  [selectUsersWithDepartments, selectPosts, selectSearchTerm],
  (usersWithDepartments, posts, searchTerm) => {
    // 如果没有搜索词，返回所有用户
    if (!searchTerm) {
      return usersWithDepartments.map(user => ({
        ...user,
        posts: posts.filter(post => post.authorId === user.id)
      }))
    }
    
    // 根据搜索词过滤用户（搜索用户名称和部门名称）
    const filteredUsers = usersWithDepartments.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    // 为过滤后的用户添加他们的文章
    return filteredUsers.map(user => ({
      ...user,
      posts: posts.filter(post => post.authorId === user.id)
    }))
  }
)

/**
 * 5. 统计数据
 * 从多个命名空间获取数据并计算统计数据
 */
const selectStatistics = createSelector(
  [selectUsers, selectDepartments, selectPosts],
  (users, departments, posts) => {
    return {
      totalUsers: users.length,
      totalDepartments: departments.length,
      totalPosts: posts.length,
      averagePostsPerUser: users.length ? posts.length / users.length : 0,
      departmentsWithUsers: departments.filter(dept => 
        users.some(user => user.departmentId === dept.id)
      ).length
    }
  }
)

/**
 * 6. 带过滤器的用户列表
 * 组合 ui 命名空间的过滤器和 userModule 的用户数据
 */
const selectFilteredUsers = createSelector(
  [selectUsersWithDepartments, selectDepartmentFilter],
  (usersWithDepartments, departmentFilter) => {
    if (!departmentFilter) return usersWithDepartments
    
    return usersWithDepartments.filter(user => 
      user.departmentId === departmentFilter
    )
  }
)

// ==================== 4. 使用示例 ====================

/*
使用说明：

createSelector 接受两个参数：
1. 输入选择器数组（input selectors）- 可以从不同的 state 作用域获取数据
2. 结果函数（result function）- 接收输入选择器的返回值作为参数，并返回计算结果

示例：
const selectExample = createSelector(
  [selectA, selectB, selectC],  // 从不同作用域获取数据
  (a, b, c) => {
    // 在这里进行计算并返回结果
    return a + b + c
  }
)

特点：
1. 记忆化（Memoization）- 相同输入时直接返回缓存结果，避免重复计算
2. 可组合 - 可以将简单的 selector 组合成复杂的选择器
3. 性能优化 - 只有当输入选择器的值发生变化时才重新计算

实际使用：
const state = {
  users: [
    { id: 1, name: 'Alice', departmentId: 1 },
    { id: 2, name: 'Bob', departmentId: 2 }
  ],
  departments: [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Marketing' }
  ],
  posts: [
    { id: 1, title: 'Redux Basics', authorId: 1 },
    { id: 2, title: 'Advanced Redux', authorId: 1 }
  ],
  currentUser: 1,
  searchTerm: ''
}

// 获取用户及其部门信息
const usersWithDepartments = selectUsersWithDepartments(state)

// 获取当前用户详情
const currentUser = selectCurrentUserDetails(state)

// 获取当前用户及其文章
const userWithPosts = selectCurrentUserWithPosts(state)

// 获取统计数据
const statistics = selectStatistics(state)
*/

export {
  selectUsersWithDepartments,
  selectCurrentUserDetails,
  selectCurrentUserWithPosts,
  selectFilteredUsersWithPosts,
  selectStatistics,
  selectFilteredUsers
}

export type { User, Department, Post, RootState, UserModule, DepartmentModule, PostModule, UIModule }