import React, { useState, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ImageRounded, SentimentSatisfiedAlt, Add, DragIndicator,
} from '@mui/icons-material';
import axios from 'axios';
import styles from './EditorTop.module.css';
import { InitialFileName, ChangeCurrentFileId, CurrentFileName } from '../../Redux/ExplorerSlice';

function EditorTop({ FileDetails }) {
  const dispatch = useDispatch();
  const {
    CoverPhoto, Icon, ref_id, icon,
  } = FileDetails;

  // state
  const [ImageRepositioning, setImageRepositioning] = useState({
    state: false, value: 50, IsMoving: false,
  });
  const [ShowEmojiPicker, setShowEmojiPicker] = useState(false);

  // redux
  const InitialFileDetails = useSelector((state) => state.ExplorerDetails.InitialValues);

  const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

  const [CurrentCoverPhoto, setCurrentCoverPhoto] = useState(null);

  function CoverPhotoStyle() {
    if (CoverPhoto === null && CurrentCoverPhoto === null) {
      return { display: 'none' };
    } if (ImageRepositioning.state === true) {
      return { display: 'block', cursor: 'all-scroll' };
    }
    return { display: 'block' };
  }

  function ImageRepositioningSystem(e) {
    e.preventDefault();
    if (ImageRepositioning.state === true) {
      setImageRepositioning({ ...ImageRepositioning, IsMoving: true });
    }
  }

  function TrackCoverPhotoPosition(e) {
    const { IsMoving, value } = ImageRepositioning;
    if (IsMoving === true) {
      if (e.movementY < 0 && value > 0) {
        setImageRepositioning({ ...ImageRepositioning, value: value - 0.4 });
      } else if (e.movementY > 0 && value < 100) {
        setImageRepositioning({ ...ImageRepositioning, value: value + 0.4 });
      }
    }
  }

  function save_details() {
    console.log('save details');
  }

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
    <div id={styles.top}>
      <div
        id={styles.cover_photo}
        style={CoverPhoto == null && CurrentCoverPhoto === null ? { height: '8rem' } : { height: '14rem' }}
        onMouseDown={(e) => { ImageRepositioningSystem(e); }}
        onMouseMove={(e) => { TrackCoverPhotoPosition(e); }}
        onMouseUp={() => { console.log('worked'); setImageRepositioning({ ...ImageRepositioning, IsMoving: false }); }}

      >
        <div id={styles.cover_image_wrap} style={CoverPhotoStyle()}>
          {
              CoverPhoto != null
                ? <img id={styles.image} src={CoverPhoto} alt="" />
                : CurrentCoverPhoto != null
                  ? <img id={styles.image} style={{ objectPosition: `center ${ImageRepositioning.value}%` }} src={CurrentCoverPhoto} alt="" />
                  : ''
            }
          <div id={styles.cover_photo_options}>
            {
                !ImageRepositioning.state
                  ? (
                    <>
                      <div className={styles.cover_photo_options_comps}>Change cover</div>
                      <div
                        className={styles.cover_photo_options_comps}
                        onClick={() => {
                          setImageRepositioning({ ...ImageRepositioning, state: true });
                        }}
                      >
                        Reposition
                      </div>
                    </>
                  )
                  : (
                    <>
                      <div className={styles.cover_photo_options_comps}>Save Position</div>
                      <div
                        className={styles.cover_photo_options_comps}
                        onClick={() => {
                          setImageRepositioning({ ...ImageRepositioning, state: false });
                        }}
                      >
                        Cancel

                      </div>
                    </>
                  )
              }

          </div>
        </div>
      </div>
      <div id={styles.centered_area_wrap}>
        <button type="button" onClick={() => { save_details(); }} id={styles.save_button}>save</button>
        <div id={styles.centered_area_inner_wrap}>
          <div id={styles.emoji} onClick={() => { setShowEmojiPicker(true); }}>{icon}</div>
          {/* this div used to cover the whole page when user is checking the options
        it is not visible tho but stops users from clicking anywhere else */}
          <div
            className={styles.overlay_container}
            style={ShowEmojiPicker ? { width: '100vw', height: '100vh' } : { width: '0vw', height: '0vh' }}
            onClick={() => { setShowEmojiPicker(false); }}
          />

          <Suspense fallback={<div />}>
            {ShowEmojiPicker && (
              <div id={styles.emoji_picker}>
                <LazyEmojiPicker
                  onEmojiClick={(e) => {
                    dispatch(ChangeCurrentFileId(ref_id));
                    dispatch(CurrentFileName({
                      FileName: InitialFileDetails.FileName, Icon: e.emoji,
                    }));
                    setShowEmojiPicker(false);
                  }}
                />
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

  );
}

export default EditorTop;
