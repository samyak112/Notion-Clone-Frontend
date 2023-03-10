import React from 'react';
import { ImageRounded, SentimentSatisfiedAlt } from '@mui/icons-material';
import styles from './Editor.module.css';
import CoverPhoto from '../../assets/cover_photo.jpeg';

function Editor() {
  return (
    <div id={styles.main}>

      <div id={styles.top}>
        <div id={styles.cover_photo}>
          <div id={styles.cover_image_wrap}>
            <img id={styles.image} src={CoverPhoto} alt="" />
          </div>
        </div>
        <div id={styles.centered_area_wrap}>
          <div id={styles.centered_area_inner_wrap}>
            <div id={styles.emoji}>πΆβπ«οΈ</div>
            <div id={styles.options}>
              <div className={styles.options_comps}>
                <SentimentSatisfiedAlt />
                Add icon
              </div>
              <div className={styles.options_comps}>
                <ImageRounded />
                Add cover
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id={styles.main_content_wrap}>
        <div id={styles.main_content}>
          <div className={styles.editor_comps} id={styles.title}>
            <input className={styles.input_field} type="text" placeholder="Untitled" />
          </div>
          <div className={styles.editor_comps} id={styles.content}></div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
