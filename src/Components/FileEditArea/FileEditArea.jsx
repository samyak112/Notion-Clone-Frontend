import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './FileEditArea.module.css';
import { ExplorerWidthValue, StartTracking } from '../../Redux/ExplorerSlice';
import Editor from '../Editor/Editor';

function FileEditArea() {
  const dispatch = useDispatch();
  const ExplorerWidth = useSelector((state) => state.ExplorerDetails.value);
  const IsTracking = useSelector((state) => state.ExplorerDetails.tracker);

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
    <div
      id={styles.main}
      onMouseUp={StopTracking}
      onMouseMove={ExtendExplorer}
    >
      <div id={styles.file_details}>File details here</div>
      <Editor />
    </div>
  );
}

export default FileEditArea;
