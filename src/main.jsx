import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { BrowserRouter } from "react-router";
import { setUpFirebase } from './core/utils/setUpFirebase.js'

const queryClient = new QueryClient()
setUpFirebase()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
