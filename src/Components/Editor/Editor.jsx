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
  // const { FileId } = useParams();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   setblocks(values);
  // }, [values]);

  // useEffect(() => {
  //   if (CurrentFileId !== ref_id) {
  //     console.log('ye kara rha h aisi test');
  //     dispatch(ChangeCurrentFileId(ref_id));
  //     dispatch(CurrentFileName({
  //       FileName: InitialFileDetails.FileName, Icon: InitialFileDetails.Icon,
  //     }));
  //   }
  // });

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

  // function AddBlock() {

  // }

  // function StyleToRender(elem) {
  //   if (CurrentEditedBlock._id === null) {
  //     return BlockStyles[0][elem.style].style;
  //   } else if (CurrentEditedBlock._id === elem._id) {
  //     // console.log('hahah');
  //     return BlockStyles[0][CurrentEditedBlock.style].style;
  //   }
  //   // else {
  //   //   console.log('aads');
  //   // }
  // }

  // function ContentToRender(elem) {
  //   if (CurrentEditedBlock._id === null) {
  //     return elem.value;
  //   } else if (CurrentEditedBlock._id === elem._id) {
  //     // console.log('using this one');
  //     return CurrentEditedBlock.value;
  //   }
  // }

  // function OnChangeHandler(e, elem) {
  //   const value = e.target.outerText;
  //   const { _id } = CurrentEditedBlock;
  //   var IsNewId = false;
  //   if (_id !== elem._id) {
  //     console.log('this did ran');
  //     IsNewId = true;
  //     // setCurrentEditedBlock(elem);
  //   }
  //   if (value.length === 0) {
  //     console.log('naah this did');
  //     // TempVal.value = ' ';
  //     setCurrentEditedBlock({ ...CurrentEditedBlock, value: ' ' });
  //   } else if (value.length !== 0) {
  //     // T/empVal.value = value;
  //   }
  //   console.log(IsNewId, 'this is the boolean');
  //   setCurrentEditedBlock({ ...CurrentEditedBlock, value });
  // }

  // console.log(CurrentEditedBlock);

  // console.log(blocks);

  function UpdateBlocks(payload, type = 'default') {
    const { index, value, IsNewBlock } = payload;

    if (IsNewBlock === false) {
      const newArray = [...blocks];

      if (type === 'checkbox') {
        // console.log(type);
        newArray[index].isChecked = payload.isChecked;
        // setblocks(newArray);
      } else {
        newArray[index].value = value;
      }
      setblocks(newArray);
    } else {
      const newArray = [...blocks];
      // this value is a non-breaking space character
      // didnt destrcutred style because it wont be available when the block is not new
      newArray.splice(index + 1, 0, { _id: uuidv4(), value: '\u00A0', style: payload.style });
      setblocks(newArray);
    }
  }

  function DeleteBlock(payload) {
    const newArray = [...blocks];
    newArray.splice(payload, 1);
    setblocks(newArray);
  }

  function save_details() {
    console.log('save details');
  }

  // console.log(blocks, 'these are the blocks');

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
                />
              ))
              : (
                <div
                  id={styles.add_first_block}
                  onClick={() => {
                    setblocks([{
                      _id: uuidv4(), value: '\u00A0', style: 'to_do_list', isChecked: true,
                    }]);
                  }}
                >
                  <div id={styles.icon}><DescriptionIcon /></div>
                  <div id={styles.text}>Add New Block</div>
                </div>
              )

            }
            {/* {
              blocks != null
                ? blocks.map((elem) => (

                  <div
                    className={styles.content_blocks}
                    style={StyleToRender(elem)}
                    placeholder={BlockStyles[0][elem.style].name}
                    contentEditable
                    onInput={(e) => { OnChangeHandler(e, elem); }}

                  >
                    <div
                      className={styles.options_wrap}
                    >
                      <Add className={styles.options} onClick={() => { AddBlock(elem.value); }} />
                      <DragIndicator className={styles.options} />
                    </div>

                    {
                    elem.value === ''
                      ? <div placeholder="Press '/' for commands">&nbsp;</div>
                      : <div>{ContentToRender(elem)}</div>
                    }
                  </div>
                ))
                : ''
            } */}
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
