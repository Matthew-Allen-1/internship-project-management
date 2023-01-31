import React, { createContext, useState } from 'react';

const UserContext = createContext(null);

function UserProvider({children}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [newTaskMessage, setNewTaskMessage] = useState({state: false, msg: ''})

  function loginUser(payload) {
    setCurrentUser({ ...payload })
  }

  function updateNewTaskMessage(boolean, msg){
    setNewTaskMessage({state: boolean, msg: msg})
  }


  return (
    <UserContext.Provider value={{currentUser, newTaskMessage, loginUser, updateNewTaskMessage}}>
      {children}
    </UserContext.Provider>
  )
}

export{ UserProvider, UserContext }