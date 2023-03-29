// Libraries
import React from 'react'
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import { useQuery } from 'react-query'
import { UserContext } from './hooks/UserContext'

// Pages
import Home from './pages/HomePage/HomePage'
import Login from './pages/LoginPage/LoginPage'
import SignUp from './pages/SignUpPage/SignUp'
import PrivateRoutes from './utils/PrivateRoutes'

//Styling
import './index.css'

// Authentication
import { findUser } from './ApiServices/AuthService';


export default function App() {

  // const { data: userData,  isLoading: userLoading, isError: userError } = useQuery('user', findUser);
  // if(isLoading) return <p>Loading...</p>
  // if(isError) return <p>An Error occurred</p>
  
  return (
    <Router>
      {/* <UserContext.Provider value={{ userData, userLoading, userError }}> */}
      <Routes>
        <Route path = "/" element = {<SignUp />} />
        <Route path = "/Login" element = {<Login />} />

        {/* <Route element={ <PrivateRoutes/>}> */}
          <Route path = "/task-manager" element = {<Home/>}/>
        {/* </Route> */}
      </Routes>
      {/* </UserContext.Provider> */}
    </Router>
  )
}

