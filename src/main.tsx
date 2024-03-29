import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/setup-browser')
  worker.start().then(renderApp)
}

function renderApp() {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
