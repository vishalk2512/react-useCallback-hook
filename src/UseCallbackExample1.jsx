import { useCallback, useEffect, useRef, useState } from 'react'

const initialState = {
  post: {},
  id: 1,
  status: '',
}

const UseCallbackExample1 = () => {
  const [state, setState] = useState(initialState)
  const controllerRef = useRef(null)

  const { post, id, status } = state

  const fetchPost = useCallback(async () => {
    controllerRef.current = new AbortController()

    try {
      setState((currState) => ({ ...currState, status: 'pending' }))

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        { signal: controllerRef.current?.signal }
      )

      if (!response.ok) {
        throw new Error('Post not found!')
      }

      const post = await response.json()
      setState((currState) => ({
        ...currState,
        post,
        status: 'resolved',
      }))
    } catch (error) {
      console.error(error.message)

      if (error.name === 'AbortError') {
        setState((currState) => ({ ...currState, status: 'pending' }))
      } else {
        setState((currState) => ({
          ...currState,
          status: 'rejected',
        }))
      }
    }
  }, [id])

  useEffect(() => {
    fetchPost()

    return () => {
      controllerRef.current?.abort()
    }
  }, [fetchPost])

  return (
    <div>
      <div>
        <button
          disabled={id <= 1 || status === 'pending'}
          onClick={() =>
            setState((currState) => ({
              ...currState,
              id: currState.id - 1,
            }))
          }
        >
          previous
        </button>
        <button
          disabled={id >= 100 || status === 'pending'}
          onClick={() =>
            setState((currState) => ({
              ...currState,
              id: currState.id + 1,
            }))
          }
        >
          next
        </button>
      </div>
      <h1>My Post {id}</h1>
      {status === 'pending' && <h1>Loading.......</h1>}
      {status === 'rejected' && <h1>Post not found!</h1>}
      {status === 'resolved' && (
        <>
          <h2>{post?.title}</h2>
          <p>{post?.body}</p>
        </>
      )}
    </div>
  )
}
export default UseCallbackExample1
