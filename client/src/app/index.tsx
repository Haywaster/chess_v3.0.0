import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { AppRouter } from './router'
import './styles/index.scss'

const router = createBrowserRouter(AppRouter)
const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />)
}
