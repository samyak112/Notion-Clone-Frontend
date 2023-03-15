import React, { useEffect, useState } from 'react';
import Explorer from '../../Components/Explorer/Explorer';
import styles from './dashboard.module.css';
import FileEditArea from '../../Components/FileEditArea/FileEditArea';

function Register() {
  // Initially set to false to show that data is still loading
  const [FileData, setFileData] = useState(false);
  const url = import.meta.env.VITE_URL;

  const GetAllFilesData = async () => {
    const res = await fetch(`${url}/FileData`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
    });
    const data = await res.json();
    setFileData(data.data);
  };

  useEffect(() => {
    GetAllFilesData();
  }, []);

  return (
    <div id={styles.main}>
      <div id={styles.explorer}><Explorer FileData={FileData} /></div>
      <div id={styles.editor}><FileEditArea /></div>
    </div>
  );
}

export default Register;
