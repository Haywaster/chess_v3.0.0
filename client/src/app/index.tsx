/* eslint-disable no-console */

import ReactDOM from 'react-dom/client'

import { App } from './App.tsx'

import './styles/index.scss'

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />)
}

// Регистрация SW после загрузки страницы
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        console.log('SW зарегистрирован:', reg.scope)
      })
      .catch(err => {
        console.error('Ошибка регистрации SW:', err)
      })
  })
}
