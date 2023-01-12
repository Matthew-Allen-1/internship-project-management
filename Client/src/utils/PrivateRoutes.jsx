import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../hooks/UserContext'

export default function PrivateRoutes() {
  // const { userData, userLoading } = useContext(UserContext)
  const jwt = localStorage.getItem('chtjwt');

  // if(userLoading) {
  //   return <h2>Loading...</h2>
  // }


  return(
    jwt ? <Outlet /> : <Navigate to="/login" />
  )
}