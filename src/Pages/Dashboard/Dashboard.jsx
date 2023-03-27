import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Explorer from '../../Components/Explorer/Explorer';
import styles from './dashboard.module.css';
import FileEditArea from '../../Components/FileEditArea/FileEditArea';
import { ReloadData } from '../../Redux/ExplorerSlice';

function Register() {
  // Initially set to false to show that data is still loading
  const [FileData, setFileData] = useState(false);
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_URL;
  const IsReload = useSelector((state) => state.ExplorerDetails.IsReload);

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

  // had to make another useeffect
  //  just for this reload because if i used only useeffect
  // then it would have created problems for reload
  useEffect(() => {
    if (IsReload === true) {
      GetAllFilesData();
      dispatch(ReloadData(false));
    }
  }, [IsReload]);

  return (
    <div id={styles.main}>
      <div id={styles.explorer}><Explorer FileData={FileData} /></div>
      <div id={styles.editor}><FileEditArea /></div>
    </div>
  );
}

export default Register;
