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
    path: "/Quolors/",
    element: <App />,
    children: [
      {
        path: "/Quolors/",
        element: <Home />
      },
      {
        path: "/Quolors/Generate",
        element: <Generate />
      },
      {
        path: "/Quolors/Favourite",
        element: <Favourite />
      },
      
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
