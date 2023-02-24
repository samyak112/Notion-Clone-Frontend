/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Explorer from '../../Components/Explorer/Explorer';
import styles from './dashboard.module.css';
import { ExplorerWidthValue, StartTracking } from '../../Redux/ExplorerSlice';

function Register() {
  const ExplorerWidth = useSelector((state) => state.ExplorerDetails.value);
  const IsTracking = useSelector((state) => state.ExplorerDetails.tracker);

  const dispatch = useDispatch();

  function StopTracking() {
    dispatch(StartTracking(false));
  }

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
    <div id={styles.main} style={{ display: 'grid', gridTemplateColumns: `${ExplorerWidth}px auto` }} onMouseMove={ExtendExplorer}>
      <div id={styles.explorer}><Explorer /></div>
      <div id={styles.editor} onMouseUp={StopTracking}>ddd</div>
    </div>
  );
}

export default Register;
