import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './FileEditArea.module.css';
import { ExplorerWidthValue, StartTracking } from '../../Redux/ExplorerSlice';
import Editor from '../Editor/Editor';

function FileEditArea() {
  const dispatch = useDispatch();
  const ExplorerWidth = useSelector((state) => state.ExplorerDetails.value);
  const IsTracking = useSelector((state) => state.ExplorerDetails.tracker);
  const { FileId } = useParams();
  const url = import.meta.env.VITE_URL;
  const [IndividualFileData, setIndividualFileData] = useState(null);

  function StopTracking() {
    dispatch(StartTracking(false));
  }
  

  const GetFileData = async () => {
    const res = await fetch(`${url}/FileData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        FileId,
      }),
    });
    const data = await res.json();
    setIndividualFileData(data);
  };

  useEffect(() => {
    GetFileData();
  }, []);

  function ExtendExplorer(e) {
    if (IsTracking === true) {
      if (e.clientX > ExplorerWidth) {
        if (ExplorerWidth < 500) {
          dispatch(ExplorerWidthValue(ExplorerWidth + 5));
        }
      }
    }
  }

  return (
    <div
      id={styles.main}
      onMouseUp={StopTracking}
      onMouseMove={ExtendExplorer}
    >
      <div id={styles.file_details}>File details here</div>
      <Editor IndividualFileData={IndividualFileData} />
    </div>
  );
}

export default FileEditArea;
