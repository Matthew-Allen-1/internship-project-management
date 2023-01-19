// Libraries
import React from 'react'
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"

// Pages
import Home from './pages/HomePage/HomePage'
import Login from './pages/LoginPage/LoginPage'
import SignUp from './pages/SignUpPage/SignUp'
import PrivateRoutes from './utils/PrivateRoutes'

//Styling
import './index.css'


export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<SignUp />} />
        <Route path = "/Login" element = {<Login />} />
        <Route element={ <PrivateRoutes/>}>
          <Route path = "/task-manager" element = {<Home/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

