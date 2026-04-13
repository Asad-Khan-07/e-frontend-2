import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/context.jsx'
// import { CartProvider } from './context/context.js'
// import { CartProvider } from './context/context.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <CartProvider>
  <App />
</CartProvider>
  </StrictMode>,
)
