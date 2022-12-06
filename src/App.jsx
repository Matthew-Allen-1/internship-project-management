import { useState } from 'react'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import CreateTask from './Components/CreateTask'
import GroupedTask from './Components/GroupedTask'
import './index.css'


function App() {
  
  return (
    <div className = "App">
      <Navbar />
      <main>
        <Sidebar number = {5} />
        <div className="task-section">
          <CreateTask />
          <GroupedTask />
        </div>
      </main>
      
    </div>
  )
}

export default App
