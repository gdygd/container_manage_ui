import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../pages/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ContainersPage } from '../pages/ContainersPage';
import { StatsPage } from '../pages/StatsPage';
import { EventsPage } from '../pages/EventsPage';
import { HostsPage } from '../pages/HostsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
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
]);
