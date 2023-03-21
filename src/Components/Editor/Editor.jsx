/* eslint-disable no-underscore-dangle */
import React, {
  lazy, Suspense, useEffect, useState,
} from 'react';
import { ImageRounded, SentimentSatisfiedAlt } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './Editor.module.css';
import { CurrentFileName } from '../../Redux/ExplorerSlice';
import Blocks from '../Blocks/Blocks';

function Editor({ IndividualFileData }) {
  const CurrentFileDetails = useSelector((state) => state.ExplorerDetails.CurrentValue);
  const { CoverPhoto, values } = IndividualFileData;
  const [blocks, setblocks] = useState(null);
  const [CurrentCoverPhoto, setCurrentCoverPhoto] = useState(null);
  const { FileName, Icon } = CurrentFileDetails;
  const [ShowEmojiPicker, setShowEmojiPicker] = useState(false);
  const [DraggingDetails, setDraggingDetails] = useState({
    Started: false, source: null, destination: null, current: null, direction: null,
  });
  const { FileId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    setblocks(values);
  }, [values]);

  // useEffect(() => {
  //   console.log('this ran.');
  //   setCurrentCoverPhoto(null);
  // }, [FileId]);

  const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

  function GetRandomCoverPhoto() {
    axios.get('https://api.unsplash.com/photos/random/?client_id=dEEKpPdrq662jfcMhkUThg_ICPT4EVxnNnUFmIIur1s')
      .then((response) => {
        setCurrentCoverPhoto(response.data.urls.regular);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div id={styles.main}>

      <div id={styles.top}>
        <div id={styles.cover_photo} style={CoverPhoto == null && CurrentCoverPhoto === null ? { height: '8rem' } : { height: '14rem' }}>
          <div id={styles.cover_image_wrap} style={CoverPhoto == null && CurrentCoverPhoto === null ? { display: 'none' } : { display: 'block' }}>
            {
              CoverPhoto != null
                ? <img id={styles.image} src={CoverPhoto} alt="" />
                : CurrentCoverPhoto != null
                  ? <img id={styles.image} src={CurrentCoverPhoto} alt="" />
                  : ''
            }
            <div id={styles.cover_photo_options}>
              <div className={styles.cover_photo_options_comps}>Change cover</div>
              <div className={styles.cover_photo_options_comps}>Reposition</div>
            </div>
          </div>
        </div>
        <div id={styles.centered_area_wrap}>
          <div id={styles.centered_area_inner_wrap}>
            <div id={styles.emoji} onClick={() => { setShowEmojiPicker(true); }}>{Icon}</div>
            {/* this div used to cover the whole page when user is checking the options
        it is not visible tho but stops users from clicking anywhere else */}
            <div className={styles.overlay_container} style={ShowEmojiPicker ? { width: '100vw', height: '100vh' } : { width: '0vw', height: '0vh' }} onClick={() => { setShowEmojiPicker(false); }} />
            <Suspense fallback={<div />}>
              {ShowEmojiPicker && (
              <div id={styles.emoji_picker}>
                <LazyEmojiPicker onEmojiClick={(e) => { dispatch(CurrentFileName({ ...CurrentFileDetails, Icon: e.emoji })); setShowEmojiPicker(false); }} />
              </div>
              )}
            </Suspense>
            <div id={styles.options}>
              {
                Icon == null
                  ? (
                    <div className={styles.options_comps}>
                      <SentimentSatisfiedAlt />
                      Add icon
                    </div>
                  )
                  : ''
              }
              {
                CoverPhoto == null && CurrentCoverPhoto == null
                  ? (
                    <div className={styles.options_comps} onClick={GetRandomCoverPhoto}>
                      <ImageRounded />
                      Add cover
                    </div>
                  )
                  : ''
              }
            </div>
          </div>
        </div>
      </div>

      <div id={styles.main_content_wrap}>
        <div id={styles.main_content}>
          <div className={styles.editor_comps} id={styles.title}>
            <input className={styles.input_field} value={FileName} onChange={(e) => { dispatch(CurrentFileName({ ...CurrentFileDetails, FileName: e.target.value })); }} type="text" placeholder="Untitled" />
          </div>
          <div className={styles.editor_comps} id={styles.content}>
            {
            blocks != null
              ? blocks.map((elem, index) => (
                <Blocks key={elem._id} BlockData={{ index: elem.index, value: elem.value }} />
              ))
              : ''
            }
          </div>
        </div>
      </div>
    </div>
  );
}

Editor.defaultProps = {
  IndividualFileData: {
    CoverPhoto: null,
    values: [{ value: '' }],
  },
};

Editor.propTypes = {
  IndividualFileData: PropTypes.shape({
    CoverPhoto: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
    })),
  }),
};

export default Editor;
