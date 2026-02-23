import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from '../pages/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ContainersPage } from '../pages/ContainersPage';
import { StatsPage } from '../pages/StatsPage';
import { EventsPage } from '../pages/EventsPage';
import { HostsPage } from '../pages/HostsPage';
import { useAuthStore } from '../features/auth/store';

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/containers" replace />;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/containers" replace />,
          },
          {
            path: 'containers',
            element: <ContainersPage />,
          },
          {
            path: 'stats',
            element: <StatsPage />,
          },
          {
            path: 'events',
            element: <EventsPage />,
          },
          {
            path: 'hosts',
            element: <HostsPage />,
          },
        ],
      },
    ],
  },
]);
