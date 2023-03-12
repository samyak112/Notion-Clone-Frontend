import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Auth from './Auth/Auth';
import Loading from './Components/Loading/Loading';

const Login = React.lazy(() => import('./Pages/Login/Login'));
const Dashboard = React.lazy(() => import('./Pages/Dashboard/Dashboard'));

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Auth />}>
          <Route
            path="/"
            element={(
              <React.Suspense fallback={<Loading />}>
                <Login />
              </React.Suspense>
          )}
          />
          <Route
            path="/:FileId"
            element={(
              <React.Suspense fallback={<Loading />}>
                <Dashboard />
              </React.Suspense>
          )}
          />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
