import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

function UserProvider({children}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [newTaskMessage, setNewTaskMessage] = useState(false)

  function loginUser(payload) {
    setCurrentUser({ ...payload })
  }

  function updateNewTaskMessage(boolean){
    setNewTaskMessage(boolean)
  }


  return (
    <UserContext.Provider value={{currentUser, newTaskMessage, loginUser, updateNewTaskMessage}}>
      {children}
    </UserContext.Provider>
  )
}

export{ UserProvider, UserContext }