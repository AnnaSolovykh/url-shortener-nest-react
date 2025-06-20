import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App'

const container = document.getElementById('root')

if (container) {
  const root = createRoot(container)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
} else {
  console.error("Root element not found. Make sure there's a <div id='root'> in your index.html")
}
