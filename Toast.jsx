import React, { useEffect, useState } from 'react'

export default function Toast({ message, onClear }){
  const [show, setShow] = useState(false)

  useEffect(() => {
    if(!message) return
    setShow(true)
    const t = setTimeout(() => {
      setShow(false)
      onClear?.()
    }, 1800)
    return () => clearTimeout(t)
  }, [message, onClear])

  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      {message || ''}
    </div>
  )
}
