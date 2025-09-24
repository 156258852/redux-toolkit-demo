import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useAppSelector, useAppDispatch } from './store/hooks.ts'
import { increment, decrement, incrementByAmount } from './store/counter/counterSlice'
import { incrementAsync } from './store/counter/counterThunks'
import { fetchUsers } from './store/user/userSlice'
import type { User } from './store/types'
import Posts from './Posts.tsx'
import UserDashboard from './UserDashboard.tsx'

function App() {
  const count = useAppSelector((state) => state.counter.value)
  const loading = useAppSelector((state) => state.counter.loading)
  const users = useAppSelector((state) => state.user.users)
  const userLoading = useAppSelector((state) => state.user.loading)
  const userError = useAppSelector((state) => state.user.error)

  const dispatch = useAppDispatch()
  const [incrementAmount, setIncrementAmount] = useState('2')

  const incrementValue = Number(incrementAmount) || 0

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Redux Toolkit Demo</h1>

      {/* Counter Card */}
      <div className="card">
        <h2>Counter</h2>
        <div className="counter-display">{count}</div>
        <div className="counter-controls">
          <button className="btn btn-secondary" onClick={() => dispatch(decrement())}>
            Decrement
          </button>
          <button className="btn btn-secondary" onClick={() => dispatch(increment())}>
            Increment
          </button>
        </div>

        <div className="input-group">
          <input
            className="input counter-input"
            value={incrementAmount}
            onChange={(e) => setIncrementAmount(e.target.value)}
            placeholder="Enter amount"
          />
          <button
            className="btn"
            onClick={() => dispatch(incrementByAmount(incrementValue))}
          >
            Add Amount
          </button>
          <button
            className="btn btn-success"
            onClick={() => dispatch(incrementAsync(incrementValue))}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Add Async'}
          </button>
        </div>
      </div>

      {/* Users Card */}
      <div className="card">
        <h2>Users (using Redux-Saga)</h2>
        <div className="counter-controls">
          <button
            className="btn"
            onClick={() => dispatch(fetchUsers())}
            disabled={userLoading}
          >
            {userLoading ? 'Loading users...' : 'Fetch Users'}
          </button>
        </div>

        {userError && <div className="error">Error: {userError}</div>}

        <ul>
          {users.map((user: User) => (
            <li key={user.id}>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
              <div className="btn-group">
                <button className="btn btn-sm btn-secondary">Edit</button>
                <button className="btn btn-sm">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* User Dashboard Card */}
      <div className="card">
        <UserDashboard />
      </div>

      {/* Posts Card */}
      <div className="card">
        <Posts />
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App