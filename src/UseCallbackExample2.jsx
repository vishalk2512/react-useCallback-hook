import { memo, useCallback, useState } from 'react'

const Greet = memo(({ displayName }) => {
  return <p>{displayName('Hello')}</p>
})

const UseCallbackExample2 = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('Vishal')

  const displayName = useCallback(
    (greetMessage) => {
      // expensive task only run when name change
      for (let i = 0; i < 999999999; i++) {}
      return `${greetMessage} ${name}`
    },
    [name]
  )

  return (
    <div>
      <input
        type='text'
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <div>
        {count}
        <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      </div>
      <Greet displayName={displayName} />
    </div>
  )
}
export default UseCallbackExample2
