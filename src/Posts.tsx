import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from './store/hooks.ts'
import {
  fetchPosts,
  createPost,
  deletePost,
  fetchPostsWithRelated
} from './store/posts/postsSlice.ts'
import type { Post } from './store/types'


const Posts: React.FC = () => {
  const dispatch = useAppDispatch()
  const { posts } = useAppSelector((state) => state.posts)
  // 为不同的操作使用独立的 loading 和 error 状态
  const fetchLoading = useAppSelector((state) => state.posts.fetchLoading)
  const createLoading = useAppSelector((state) => state.posts.createLoading)
  const deleteLoading = useAppSelector((state) => state.posts.deleteLoading)
  const fetchError = useAppSelector((state) => state.posts.fetchError)
  const createError = useAppSelector((state) => state.posts.createError)
  const deleteError = useAppSelector((state) => state.posts.deleteError)


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

  // 新增：处理并行获取文章和相关数据
  const handleFetchPostsWithRelated = () => {
    dispatch(fetchPostsWithRelated())
  }

  return (
    <div>
      <h2>Posts (using Redux-Saga)</h2>

      <div className="counter-controls" style={{ marginBottom: '1.5rem' }}>
        <button className="btn" onClick={handleFetchPosts} disabled={fetchLoading}>
          {fetchLoading ? 'Loading...' : 'Fetch Posts'}
        </button>
        <button className="btn" onClick={handleFetchPostsWithRelated} disabled={fetchLoading}>
          {fetchLoading ? 'Loading...' : 'Fetch Posts with Related Data'}
        </button>
      </div>

      {fetchError && <div className="error">Error: {fetchError}</div>}
      {createError && <div className="error">Error: {createError}</div>}
      {deleteError && <div className="error">Error: {deleteError}</div>}

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
        <button className="btn btn-success" onClick={handleCreatePost} disabled={createLoading}>
          {createLoading ? 'Creating...' : 'Create Post'}
        </button>
      </div>

      <div>
        <h3>Posts List ({posts.length})</h3>
        {posts.map((post: Post) => (
          <div key={post.id} className="card" style={{ margin: '1rem 0' }}>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div className="btn-group">
              <button className="btn btn-sm btn-secondary">Edit</button>
              <button className="btn btn-sm" onClick={() => handleDeletePost(post.id)} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Posts