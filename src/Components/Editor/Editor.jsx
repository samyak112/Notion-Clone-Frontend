/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable no-underscore-dangle */
import React, {
  lazy, Suspense, useEffect, useRef, useState,
} from 'react';
import {
  ImageRounded, SentimentSatisfiedAlt, Add, DragIndicator,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// import { useParams } from 'react-router-dom';
import styles from './Editor.module.css';
import { InitialFileName, ChangeCurrentFileId, CurrentFileName } from '../../Redux/ExplorerSlice';
import EditorTop from '../EditorTop/EditorTop';
// import BlockStyles from '../Blocks/BlockStyle';

import Blocks from '../Blocks/Blocks';

function Editor({ IndividualFileData, source }) {
  // redux
  const CurrentFileDetails = useSelector((state) => state.ExplorerDetails.CurrentValue);
  const InitialFileDetails = useSelector((state) => state.ExplorerDetails.InitialValues);
  const CurrentFileId = useSelector((state) => state.ExplorerDetails.current_id);

  // states
  const [blocks, setblocks] = useState([]);
  const [CurrentCoverPhoto, setCurrentCoverPhoto] = useState(null);
  const [ShowEmojiPicker, setShowEmojiPicker] = useState(false);
  const [ImageRepositioning, setImageRepositioning] = useState({
    state: false, value: 50, IsMoving: false,
  });
  // const [CurrentEditedBlock, setCurrentEditedBlock] = useState({
  //   _id: null, value: null, style: null,
  // });
  const [DraggingDetails, setDraggingDetails] = useState({
    Started: false, source: null, destination: null, current: null, direction: null,
  });

  // ref
  // this ref is maintainted to check if the block which is being edited is the first block
  // or not , this maintained for the logic which is being used to save the blocks
  // const IsInitialBlock = useRef(true);

  // destructured props
  const { FileName, Icon } = CurrentFileDetails;
  const { CoverPhoto, values, ref_id } = IndividualFileData;
  const dispatch = useDispatch();

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

  function FileDetailsToRender() {
    if (source === 'new') {
      return { fileName: FileName, icon: Icon };
    } else {
      if (CurrentFileId === ref_id) {
        return { fileName: FileName, icon: Icon };
      } else {
        return { fileName: InitialFileDetails.FileName, icon: InitialFileDetails.Icon };
      }
    }
  }

  const RenderedFileDetails = FileDetailsToRender();
  const { fileName, icon } = RenderedFileDetails;

  function UpdateBlocks(payload, type = 'default') {
    const {
      index, value, IsNewBlock, style,
    } = payload;

    if (IsNewBlock === false) {
      const newArray = [...blocks];
      if (type === 'checkbox') {
        newArray[index].isChecked = payload.isChecked;
      } else if (type === 'color') {
        newArray[index].color = payload.ColorValue;
      } else if (type === 'bgcolor') {
        newArray[index].bgcolor = payload.ColorValue;
      } else {
        newArray[index].value = value;
      }
      setblocks(newArray);
    } else {
      const newArray = [...blocks];
      if (payload.IsDuplicate) {
        newArray.splice(index + 1, 0, { _id: uuidv4(), value, style });
      } else {
        // this value is a non-breaking space character
        newArray.splice(index + 1, 0, { _id: uuidv4(), value: '\u00A0', style });
      }
      setblocks(newArray);
    }
  }

  function UpdateBlockStyle(payload) {
    const newArray = [...blocks];
    newArray[payload.index] = payload;
    setblocks(newArray);
  }

  function DeleteBlock(payload) {
    const newArray = [...blocks];
    // payload is the index here
    newArray.splice(payload, 1);
    setblocks(newArray);
  }

  function save_details() {
    console.log('save details');
  }

  function CoverPhotoStyle() {
    if (CoverPhoto === null && CurrentCoverPhoto === null) {
      return { display: 'none' };
    } else if (ImageRepositioning.state === true) {
      return { display: 'block', cursor: 'all-scroll' };
    } else {
      return { display: 'block' };
    }
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

  console.log(ImageRepositioning.value);

  return (
    <div
      id={styles.main}
      // onMouseMove={(e) => { TrackCoverPhotoPosition(e); }}
      // onMouseUp={() => { console.log('worked'); setImageRepositioning({ ...ImageRepositioning, IsMoving: false }); }}
    >
      <div id={styles.top}>
        <EditorTop FileDetails={{
          CoverPhoto, Icon, ref_id, icon,
        }}
        />
        {/* <div
          id={styles.cover_photo}
          style={CoverPhoto == null && CurrentCoverPhoto === null ? { height: '8rem' } : { height: '14rem' }}
          onMouseDown={(e) => { ImageRepositioningSystem(e); }}
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
        </div> */}
        {/* <div id={styles.centered_area_wrap}>
          <button type="button" onClick={() => { save_details(); }} id={styles.save_button}>save</button>
          <div id={styles.centered_area_inner_wrap}>
            <div id={styles.emoji} onClick={() => { setShowEmojiPicker(true); }}>{icon}</div> */}
        {/* this div used to cover the whole page when user is checking the options
        it is not visible tho but stops users from clicking anywhere else */}
        {/* <div
              className={styles.overlay_container}
              style={ShowEmojiPicker ? { width: '100vw', height: '100vh' } : { width: '0vw', height: '0vh' }}
              onClick={() => { setShowEmojiPicker(false); }}
            /> */}

        {/* <Suspense fallback={<div />}>
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
            </Suspense> */}

        {/* <div id={styles.options}>
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
            </div> */}
        {/* </div>
        </div> */}
      </div>

      <div id={styles.main_content_wrap}>
        <div id={styles.main_content}>
          <div className={styles.editor_comps} id={styles.title}>
            <input
              className={styles.input_field}
              value={fileName}
              onClick={() => {
                if (source === 'old') {
                  if (CurrentFileId !== ref_id) {
                    dispatch(ChangeCurrentFileId(ref_id));
                    dispatch(CurrentFileName({
                      FileName: InitialFileDetails.FileName, Icon: InitialFileDetails.Icon,
                    }));
                  }
                }
              }}
              onChange={(e) => {
                if (source === 'old') {
                  if (CurrentFileId === ref_id) {
                    dispatch(CurrentFileName({ ...CurrentFileDetails, FileName: e.target.value }));
                  } else {
                    dispatch(InitialFileName({ ...InitialFileDetails, FileName: e.target.value }));
                  }
                } else {
                  dispatch(CurrentFileName({ ...CurrentFileDetails, FileName: e.target.value }));
                }
              }}
              type="text"
              placeholder="Untitled"
            />
          </div>
          <div className={styles.editor_comps} id={styles.content}>
            {
            blocks.length !== 0
              ? blocks.map((elem, index) => (
                <Blocks
                  key={elem._id}
                  BlockData={{ elem, index }}
                  UpdateBlocks={UpdateBlocks}
                  DeleteBlock={DeleteBlock}
                  UpdateBlockStyle={UpdateBlockStyle}
                />
              ))
              : (
                <div
                  id={styles.add_first_block}
                  onClick={() => {
                    setblocks([{
                      _id: uuidv4(),
                      value: '\u00A0',
                      style: 'text',
                      color: '#37352F',
                      bgcolor: '#FFFFFF',
                    }]);
                  }}
                >
                  <div id={styles.icon}><DescriptionIcon /></div>
                  <div id={styles.text}>Add New Block</div>
                </div>
              )

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
    values: [{ value: '\u00A0', style: 'text' }],
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
