import { AppRouter } from 'shared/const/router'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/index.scss'

const router = createBrowserRouter(AppRouter)
const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />)
}
