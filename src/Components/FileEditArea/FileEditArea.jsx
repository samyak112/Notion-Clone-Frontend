/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import eyes from '../../assets/Eyes.svg';
import styles from './FileEditArea.module.css';
import {
  ExplorerWidthValue, StartTracking,
} from '../../Redux/ExplorerSlice';
import Editor from '../Editor/Editor';

function FileEditArea() {
  const dispatch = useDispatch();
  const ExplorerWidth = useSelector((state) => state.ExplorerDetails.value);
  const IsTracking = useSelector((state) => state.ExplorerDetails.tracker);
  const FilePath = useSelector((state) => state.ExplorerDetails.CurrentFilePath);
  const [IsFileUnkown, setIsFileUnkown] = useState(null);
  const { FileId } = useParams();
  const url = import.meta.env.VITE_URL;
  const [IndividualFileData, setIndividualFileData] = useState({ CoverPhoto: null, values: [] });

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
    if (data.status === 200) {
      setIndividualFileData(data.FileData);
      setIsFileUnkown(false);
    } else {
      setIsFileUnkown(true);
    }
  };

  useEffect(() => {
    GetFileData();
  }, [FileId]);

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
    <div>
      {
        IsFileUnkown === null
          ? (
            <div className={styles.main2}>
              <CircularProgress />
            </div>
          )
          : IsFileUnkown === false
            ? (
              <div
                id={styles.main}
                onMouseUp={StopTracking}
                onMouseMove={ExtendExplorer}
              >
                <div id={styles.file_details}>
                  <div id={styles.file_details_left}>
                    {FilePath === null ? '' : FilePath.path}
                  </div>
                  <div
                    id={styles.file_details_right}
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Log Out
                  </div>
                </div>
                <Editor Root={FilePath === null ? null : FilePath.Root} IndividualFileData={IndividualFileData} source="old" />
              </div>
            )
            : (
              <div className={styles.main2}>
                <div id={styles.unknown_file}>
                  <div id={styles.image_wrap} className={styles.unknown_file_comps}>
                    <img id={styles.image} src={eyes} alt="" />
                  </div>
                  <div className={styles.unknown_file_comps}>
                    This Content does not exist
                  </div>
                </div>
              </div>
            )

      }
    </div>

  );
}

export default FileEditArea;
