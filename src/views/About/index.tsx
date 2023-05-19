import React from 'react'

import { useNavigate } from 'react-router-dom'
export default function About() {

  const navigate = useNavigate();

  const skipUrl = () => {
    navigate('/home')
  }
  return (
    <div>
      <h2>About</h2>
      <button onClick={skipUrl}>toHome</button>
    </div>
  )
}
