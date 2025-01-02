import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import GunsPage from './pages/GunsPage';
import StatisticsPage from './pages/StatisticsPage';
import ScoresPage from './pages/ScoresPage';
import ShootersPage from './pages/ShootersPage';
import MyClubPage from './pages/MyClubPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CompleteProfile from './pages/CompleteProfile';
import { useAuth } from './contexts/AuthContext';
import { useClub } from './contexts/ClubContext';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading: authLoading } = useAuth();
  const { loading: clubLoading } = useClub();
  const location = useLocation();

  if (authLoading || clubLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'club',
        element: <RequireAuth><MyClubPage /></RequireAuth>
      },
      {
        path: 'statistics',
        element: <RequireAuth><StatisticsPage /></RequireAuth>
      },
      {
        path: 'scores',
        element: <RequireAuth><ScoresPage /></RequireAuth>
      },
      {
        path: 'shooters',
        element: <RequireAuth><ShootersPage /></RequireAuth>
      },
      {
        path: 'guns',
        element: <RequireAuth><GunsPage /></RequireAuth>
      },
      {
        path: '',
        element: <RequireAuth><Dashboard /></RequireAuth>
      }
    ]
  },
  {
    path: '/sign-in',
    element: <SignIn />
  },
  {
    path: '/sign-up',
    element: <SignUp />
  },
  {
    path: '/complete-profile',
    element: <RequireAuth><CompleteProfile /></RequireAuth>
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}