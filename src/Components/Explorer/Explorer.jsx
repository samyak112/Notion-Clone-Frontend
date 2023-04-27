/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import LeftArrow from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import Skeleton from '@mui/material/Skeleton';
import jwt from 'jwt-decode';
import styles from './explorer.module.css';
import { ExplorerWidthValue, StartTracking, ReloadData } from '../../Redux/ExplorerSlice';
import IndividualFiles from '../IndividualFiles/IndividualFiles';

function Explorer() {
  const token = localStorage.getItem('token');
  const UserCreds = jwt(token);
  const { username, profile_pic } = UserCreds;
  const ExplorerWidth = useSelector((state) => state.ExplorerDetails.value);
  const IsTracking = useSelector((state) => state.ExplorerDetails.tracker);

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
    setFileData(data.tree);
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

  function IntializeTracking() {
    dispatch(StartTracking(true));
  }

  function ReduceExplorer(e) {
    if (IsTracking === true) {
      if (e.movementX < 0) {
        if (ExplorerWidth > 250) {
          dispatch(ExplorerWidthValue(ExplorerWidth - 5));
        }
      }
    }
  }

  return (
    <div
      id={styles.main}
      onMouseUp={() => { dispatch(StartTracking(false)); }}
      style={{ width: `${ExplorerWidth}px` }}
      onMouseMove={ReduceExplorer}
    >
      <div id={styles.explorer}>
        <div id={styles.navbar_wrap}>
          <div id={styles.navbar}>
            <div id={styles.user_details}>
              <div id={styles.profile_image_wrap} className={styles.navbar_comps}><img id={styles.profile_image} src={profile_pic} alt="" /></div>
              <div id={styles.profile_name} className={styles.navbar_comps}>
                {`${username}' Notion`}
              </div>
            </div>
            <div id={styles.explorer_toggle_wrap}>
              <div id={styles.explorer_toggle} className={styles.navbar_comps}><LeftArrow /></div>
            </div>
          </div>
        </div>

        <div id={styles.all_docs}>
          {
            FileData.length === 0 || FileData === false
              ? new Array(5).fill().map((index) => (
                <Skeleton key={index} animation="wave" style={{ marginInline: '.5rem', padding: '.2rem' }} />
              ))
              : FileData.map((elem) => (
                <IndividualFiles
                  key={elem._id}
                  data={elem}
                />
              ))
            }
        </div>
        <div id={styles.add_new_page}>
          <AddIcon />
          {' '}
          New page
        </div>
      </div>
      <div
        id={styles.explorer_width_toggle}
        onMouseDown={IntializeTracking}
      />
    </div>
  );
}

export default Explorer;
