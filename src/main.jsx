import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Generate from './Generate';
import Favourite from './Favourite';
import Home from './Home';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/Generate",
        element: <Generate />
      },
      {
        path: "/Favourite",
        element: <Favourite />
      },
      
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
  </>,
)
