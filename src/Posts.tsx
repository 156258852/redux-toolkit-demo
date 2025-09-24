import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from './store/hooks.ts'
import {
  fetchPosts,
  createPost,
  deletePost
} from './store/posts/postsSlice.ts'
import type { Post } from './store/types'

const Posts: React.FC = () => {
  const dispatch = useAppDispatch()
  const { posts, loading, error } = useAppSelector((state) => state.posts)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const handleFetchPosts = () => {
    dispatch(fetchPosts())
  }

  const handleCreatePost = () => {
    if (title && body) {
      dispatch(createPost({ title, body, userId: 1 }))
      setTitle('')
      setBody('')
    }
  }

  const handleDeletePost = (id: number) => {
    dispatch(deletePost(id))
  }

  return (
    <div>
      <h2>Posts (using Redux-Saga)</h2>

      <div className="counter-controls" style={{ marginBottom: '1.5rem' }}>
        <button className="btn" onClick={handleFetchPosts} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Posts'}
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}

      <div className="input-group">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="input"
          rows={3}
        />
        <button className="btn btn-success" onClick={handleCreatePost}>Create Post</button>
      </div>

      <div>
        <h3>Posts List ({posts.length})</h3>
        {posts.map((post: Post) => (
          <div key={post.id} className="card" style={{ margin: '1rem 0' }}>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div className="btn-group">
              <button className="btn btn-sm btn-secondary">Edit</button>
              <button className="btn btn-sm" onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Posts