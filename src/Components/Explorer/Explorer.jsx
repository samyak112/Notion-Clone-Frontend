/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import LeftArrow from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useDispatch, useSelector } from 'react-redux';
import styles from './explorer.module.css';
import { ExplorerWidthValue, StartTracking } from '../../Redux/ExplorerSlice';

function Explorer() {
  const dispatch = useDispatch();
  const ExplorerWidth = useSelector((state) => state.ExplorerDetails.value);
  const IsTracking = useSelector((state) => state.ExplorerDetails.tracker);

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
      onMouseMove={ReduceExplorer}
    >
      <div id={styles.explorer}>
        <div id={styles.navbar_wrap}>
          <div id={styles.navbar}>
            <div id={styles.user_details}>
              <div id={styles.profile_image} className={styles.navbar_comps}>S</div>
              <div id={styles.profile_name} className={styles.navbar_comps}>Samyak Jain Notion</div>
            </div>
            <div id={styles.explorer_toggle_wrap}>
              <div id={styles.explorer_toggle} className={styles.navbar_comps}><LeftArrow /></div>
            </div>
          </div>
        </div>
        <div id={styles.all_docs}>s</div>
        <div id={styles.add_new_page}>s</div>
      </div>
      <div
        id={styles.explorer_width_toggle}
        onMouseDown={IntializeTracking}
      />
    </div>
  );
}

export default Explorer;
