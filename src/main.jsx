import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './store/index';
import './index.css'
import App from './App';
import AuthProvider from './Components/AuthProvider';
import { NotificationProvider } from './utils/notifications';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Generate from './Generate';
import Favorites from './Favorites';
import Home from './Home';
import Explore from './Explore';
import Contrast from './Contrast';
import Visualizer from './Visualizer';
import ImagePicker from './ImagePicker';
import GradientMaker from './GradientMaker';
import ColorDetails from './ColorDetails';


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
        element: <Favorites />
      },
      {
        path: "/Explore",
        element: <Explore />
      },
      {
        path: "/Contrast",
        element: <Contrast />
      },
      {
        path: "/Visualizer",
        element: <Visualizer />
      },
      {
        path: "/Picker",
        element: <ImagePicker />
      },
      {
        path: "/Gradient",
        element: <GradientMaker />
      },
      {
        path: "/color/:hex",
        element: <ColorDetails />
      }
      
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
)
