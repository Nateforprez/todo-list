import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
//import './App.css'
import StartScreen from './pages/StartScreen'
import SignIn from './pages/SignIn'
import TodoForm from './pages/TodoForm'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />}/>
          <Route path="/login" element={<StartScreen/>}/>
          <Route path="/todo-list" element={<TodoForm/>}/>
          <Route path="/sign-up" element={<SignIn/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App 
