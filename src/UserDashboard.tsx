import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { fetchUsers } from './store/user/userSlice'
import { selectFilteredUsers, selectStatistics } from './store'
import type { User } from './store/types'
import './UserDashboard.scss'

const UserDashboard: React.FC = () => {
  const dispatch = useAppDispatch()

  // 使用 selectors 获取状态
  const loading = useAppSelector((state) => state.user.loading)
  const error = useAppSelector((state) => state.user.error)

  // 使用自定义 selectors
  const [searchTerm, setSearchTerm] = useState('')
  const filteredUsers = useAppSelector((state) => selectFilteredUsers(state, searchTerm))
  const statistics = useAppSelector(selectStatistics)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  return (
    <div className="user-dashboard">
      <h2 className="user-dashboard__title">User Dashboard</h2>

      {/* 统计信息卡片 */}
      <div className="user-dashboard__stats">
        <div className="stat-card">
          <h3 className="stat-card__title">Total Users</h3>
          <p className="stat-card__value">{statistics.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-card__title">Average Posts</h3>
          <p className="stat-card__value">{statistics.averagePostsPerUser.toFixed(1)}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-card__title">Total Posts</h3>
          <p className="stat-card__value">{statistics.totalPosts}</p>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="user-dashboard__controls">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="user-dashboard__search"
        />
        <button
          onClick={() => dispatch(fetchUsers())}
          disabled={loading}
          className="user-dashboard__refresh-btn"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* 错误显示 */}
      {error && <div className="user-dashboard__error">Error: {error}</div>}

      {/* 用户列表 */}
      <div className="user-dashboard__list">
        <h3 className="user-dashboard__list-title">Users ({filteredUsers.length})</h3>
        {filteredUsers.length === 0 && !loading && (
          <p className="user-dashboard__no-users">No users found</p>
        )}
        <div className="user-list">
          {filteredUsers.map((user: User) => (
            <div key={user.id} className="user-card">
              <h4 className="user-card__name">{user.name}</h4>
              <p className="user-card__email">{user.email}</p>
              <div className="user-card__actions">
                <button className="user-card__action-btn">View Details</button>
                <button className="user-card__action-btn user-card__action-btn--delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard