import {
  useEffect, useState, React,
} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Login from '../Pages/Login/Login';
import Loading from '../Components/Loading/Loading';

function Auth() {
  const Navigate = useNavigate();

  const [AuthCheck, setAuthCheck] = useState(null);
  const url = import.meta.env.VITE_URL;
  const [LastVisitiedFileId, setLastVisitiedFileId] = useState(null);

  const GetLastVisitedFileId = async () => {
    const res = await fetch(`${url}/lastvisitedfile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
    });
    const data = await res.json();
    if (data.status === 200) {
      setLastVisitiedFileId(data.data);
      localStorage.setItem('LastVisitedFileId', data.data);
    } else {
      console.log('something went wrong');
    }
  };

  const PrivateRoutes = async () => {
    const res = await fetch(`${url}/verify_route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
    });
    const data = await res.json();

    if (data.status === 201) {
      const FileId = localStorage.getItem('LastVisitedFileId');
      if (FileId === '' || FileId === null || FileId === undefined) {
        await GetLastVisitedFileId();
      } else {
        setLastVisitiedFileId(FileId);
      }
      setAuthCheck(true);
    } else {
      setAuthCheck(false);
    }
  };

  // made a use effect here so that whenever this file is invoked through app.js then
  // this function must runs  otherwise it will have the default values in it

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === '' || token === undefined) {
      setAuthCheck(false);
    } else {
      PrivateRoutes();
    }
  });

  // useEffect(() => {

  // }, [AuthCheck]);

  return (
    <div>
      {
            AuthCheck === true
              ? window.location.pathname === '/'
                ? Navigate(`/${LastVisitiedFileId}`)
                : <Outlet />
              : AuthCheck === false
                ? <Login />
                : <Loading />
            }
    </div>
  );
}

export default Auth;
