import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/auth/index.tsx';
import { SocketProvider } from './context/index.tsx';
import { NotificationProvider } from './context/notifications/index.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <Toaster
								toastOptions={{
								success: {
									style: {
									fontSize: '14px',
									background: '#c1eaba',
									},
								},
								error: {
									style: {
									fontSize: '14px',
									background: '#ffdfd4',
									},
								},
								}}
								position='top-right'
							/>
              <AuthProvider>
                <NotificationProvider>
                  <SocketProvider>
                    <RouterProvider router={router} />
                  </SocketProvider>
                </NotificationProvider>
              </AuthProvider>
  </React.StrictMode>,
)
