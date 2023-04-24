/* eslint-disable no-else-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useState, Suspense, lazy, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ImageRounded, SentimentSatisfiedAlt,
} from '@mui/icons-material';
import axios from 'axios';
import styles from './EditorTop.module.css';
import { ChangeCurrentFileId, CurrentFileName } from '../../Redux/ExplorerSlice';

function EditorTop({ FileDetails, SaveFileData }) {
  const dispatch = useDispatch();

  // Prop
  const {
    CoverPhoto, Icon, ref_id, RenderedIcon,
  } = FileDetails;

  // state
  const [ImageRepositioning, setImageRepositioning] = useState({
    state: false, Lastvalue: 50, CurrentValue: 50, IsMoving: false,
  });
  const [ShowEmojiPicker, setShowEmojiPicker] = useState(false);
  const [ChangeCoverPhoto, setChangeCoverPhoto] = useState(false);
  const [UnsplashPicturesList, setUnsplashPicturesList] = useState(null);
  const [CurrentCoverPhoto, setCurrentCoverPhoto] = useState(null);
  const [SearchQuery, setSearchQuery] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);

  // redux
  const CurrentFileDetails = useSelector((state) => state.ExplorerDetails.CurrentValue);

  const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

  useEffect(() => {
    if (CoverPhoto != null) {
      const { value, Position } = CoverPhoto;
      setCurrentCoverPhoto(value);
      setImageRepositioning({ ...ImageRepositioning, Lastvalue: Position, CurrentValue: Position });
    }
  }, [CoverPhoto]);

  useEffect(() => {
    setIsLoading(true);
    if (SearchQuery === null || SearchQuery === '') {
      axios.get('https://api.unsplash.com/photos/random?count=30&client_id=dEEKpPdrq662jfcMhkUThg_ICPT4EVxnNnUFmIIur1s')
        .then((response) => {
          setUnsplashPicturesList(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    } else {
      setIsLoading(true);
      axios.get(`https://api.unsplash.com/search/photos?query=${SearchQuery}&per_page=30&client_id=dEEKpPdrq662jfcMhkUThg_ICPT4EVxnNnUFmIIur1s`)
        .then((response) => {
          setUnsplashPicturesList(response.data.results);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    }
  }, [SearchQuery]);

  function CoverPhotoStyle() {
    if (CurrentCoverPhoto === null) {
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
    const { IsMoving, CurrentValue } = ImageRepositioning;
    if (IsMoving === true) {
      if (e.movementY < 0 && CurrentValue > 0) {
        setImageRepositioning({ ...ImageRepositioning, CurrentValue: CurrentValue - 0.4 });
      } else if (e.movementY > 0 && CurrentValue < 100) {
        setImageRepositioning({ ...ImageRepositioning, CurrentValue: CurrentValue + 0.4 });
      }
    }
  }

  function SaveDetails() {
    let payload = { CoverPhotoData: null };
    const { Lastvalue } = ImageRepositioning;
    if (CoverPhoto != null) {
      const { value, Position } = CoverPhoto;
      if (CurrentCoverPhoto !== value) {
        payload = { CoverPhotoData: { CoverPhoto: CurrentCoverPhoto } };
      }
      if (Lastvalue !== Position) {
        payload = { ...payload, CoverPhotoData: { ...payload.CoverPhotoData, Position: Lastvalue } };
      }

      SaveFileData(payload);
    } else {
      SaveFileData({ CoverPhotoData: { Position: Lastvalue, CoverPhoto: CurrentCoverPhoto } });
    }
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

  function ImagePositionStyle() {
    const {
      Lastvalue, CurrentValue, state,
    } = ImageRepositioning;

    if (state) {
      return { objectPosition: `center ${CurrentValue}%` };
    } else {
      return { objectPosition: `center ${Lastvalue}%` };
    }
  }

  return (
    <div id={styles.top}>
      <div
        id={styles.cover_photo}
        style={CurrentCoverPhoto === null ? { height: '8rem' } : { height: '14rem' }}
        onMouseDown={(e) => { ImageRepositioningSystem(e); }}
        onMouseMove={(e) => { TrackCoverPhotoPosition(e); }}
        onMouseUp={() => { setImageRepositioning({ ...ImageRepositioning, IsMoving: false }); }}

      >
        <div id={styles.cover_image_wrap} style={CoverPhotoStyle()}>
          {CurrentCoverPhoto != null
            ? <img id={styles.image} style={ImagePositionStyle()} src={CurrentCoverPhoto} alt="" />
            : ''}
          <div id={styles.cover_photo_options}>
            {
                !ImageRepositioning.state
                  ? (
                    <>
                      <div
                        className={styles.cover_photo_options_comps}
                        onClick={() => { setChangeCoverPhoto(!ChangeCoverPhoto); }}
                      >
                        Change cover

                      </div>
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
                      <div
                        className={styles.cover_photo_options_comps}
                        onClick={() => {
                          setImageRepositioning({
                            ...ImageRepositioning,
                            state: false,
                            Lastvalue: ImageRepositioning.CurrentValue,
                          });
                        }}

                      >
                        Save Position

                      </div>
                      <div
                        className={styles.cover_photo_options_comps}
                        onClick={() => {
                          setImageRepositioning({
                            ...ImageRepositioning,
                            state: false,
                            CurrentValue: ImageRepositioning.Lastvalue,
                          });
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
        <div
          id={styles.change_cover_wrap}
          style={ChangeCoverPhoto ? { display: 'block' } : { display: 'none' }}
          onBlur={() => { setChangeCoverPhoto(false); }}
        >
          <div className={styles.change_cover_comps} id={styles.search_bar}>
            <input value={SearchQuery} type="text" onChange={(e) => { setSearchQuery(e.target.value); }} placeholder="Search for an Image" />
          </div>
          <div
            className={styles.change_cover_comps}
            id={styles.results}
          >
            {
                  UnsplashPicturesList != null
                    ? IsLoading
                      ? <div className={styles.loading} />
                      : UnsplashPicturesList.map((elem) => (
                        <div className={styles.unsplash_image_wrap}>
                          <div className={styles.image_wrap}>
                            <img
                              onClick={() => { setCurrentCoverPhoto(elem.urls.regular); }}
                              className={styles.actual_image}
                              src={elem.urls.regular}
                              alt=""
                            />
                          </div>
                          <div className={styles.image_creator}>
                            <div>By</div>
                            <a target="_blank" href={elem.user.links.html} rel="noreferrer">{elem.user.first_name}</a>
                          </div>
                        </div>
                      ))
                    : 'Limit Reached for Fetching Results'
                }
          </div>
        </div>
        <div id={styles.centered_area_inner_wrap}>
          <div id={styles.emoji} onClick={() => { setShowEmojiPicker(true); }}>{RenderedIcon}</div>
          <div id={styles.save_button_wrap}>
            <button type="button" onClick={() => { SaveDetails(); }} id={styles.save_button}>Save Changes</button>
          </div>

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
                      FileName: CurrentFileDetails.FileName, Icon: e.emoji,
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
                CurrentCoverPhoto == null
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
