// 全局类型定义
export interface User {
  id: number
  name: string
  email: string
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
}