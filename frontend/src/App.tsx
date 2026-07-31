import { useState } from 'react'
//import './App.css'

function App() {

  return (
    <>
      <h1>Hello Frontend</h1>
      <form action="/api/submit-user-data" method="POST">
        <div>
          <label htmlFor='username'></label>
        </div>
      </form>
    </>
  )
}

export default App 
