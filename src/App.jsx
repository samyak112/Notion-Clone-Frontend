import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Loading from './Components/Loading/Loading';

const Login = React.lazy(() => import('./Pages/Login/Login'));
const Dashboard = React.lazy(() => import('./Pages/Dashboard/Dashboard'));

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={(
            <React.Suspense fallback={<Loading />}>
              <Login />
            </React.Suspense>
          )}
        />

        <Route
          path="/dashboard"
          element={(
            <React.Suspense fallback={<Loading />}>
              <Dashboard />
            </React.Suspense>
          )}
        />

      </Routes>
    </Router>
  );
}

export default App;
