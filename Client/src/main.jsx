import React from 'react'
import ReactDOM from 'react-dom/client'

// Libraries
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

// Hooks & Context
import { UserProvider } from './context/UserContext'

// Components
import App from './App'

// Styling
import './index.css'

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client = {queryClient}>
    <UserProvider>
        <App />
    </UserProvider>
    <ReactQueryDevtools initialIsOpen={false}/>
  </QueryClientProvider>
)
