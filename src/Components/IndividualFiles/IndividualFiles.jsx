/* eslint-disable no-console */
/* eslint-disable no-lonely-if */
/* eslint-disable keyword-spacing */
/* eslint-disable no-else-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, {
  lazy, Suspense, useEffect, useState,
} from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import { DeleteOutlineOutlined, DriveFileRenameOutline } from '@mui/icons-material';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import styles from './IndividualFiles.module.css';
import Editor from '../Editor/Editor';
import {
  ChangeCurrentFileId, CurrentFileName, InitialFileName, UpdateCurrentFilePath, UpdateTree,
} from '../../Redux/ExplorerSlice';

function IndividualFiles({ data, margin, PreviousNodesData }) {
  const {
    FileName, _id, icon, parent,
  } = data;

  const dispatch = useDispatch();
  const { FileId } = useParams();

  // Redux
  const CurrentFileDetails = useSelector((state) => state.ExplorerDetails.CurrentValue);
  const CurrentFileId = useSelector((state) => state.ExplorerDetails.current_id);

  const IconConfig = { IconSize: 'small', IconColor: '#5A5A57', ArrowColor: '#636363' };
  const { IconSize, IconColor, ArrowColor } = IconConfig;

  // States
  const [expand, setexpand] = useState(false);
  const [ShowOptions, setShowOptions] = useState(false);
  const [NewFileOption, setNewFileOption] = useState(false);
  const [ShowEmojiPicker, setShowEmojiPicker] = useState(false);
  const [NewFileName, setNewFileName] = useState({ IsOpen: false, value: '' });
  const handleClose = () => {
    setNewFileOption(false);
    dispatch(CurrentFileName({ FileName, Icon: icon }));
  };

  const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

  const url = import.meta.env.VITE_URL;

  function PreviousNodesValue() {
    let TemporaryArr = { Path: '', Root: '' };
    if(parent !== null) {
      TemporaryArr = { Path: `${PreviousNodesData.Path}  /  ${FileName}`, Root: PreviousNodesData.Root };
    } else{
      TemporaryArr = { Path: FileName, Root: _id };
    }
    return TemporaryArr;
  }
  const propValue = PreviousNodesValue();

  const UpdateFileData = async (Item, type) => {
    const res = await fetch(`${url}/FileData/FileDetails`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        FileId: _id, ItemData: { Item, type },
      }),
    });
    const response = await res.json();
    if(response.status === 200) {
      dispatch(UpdateTree({
        data: {
          NewItem: Item,
          Target: _id,
          Root: parent !== null ? PreviousNodesData.Root : _id,
        },
        action: 'update',
      }));
    }
  };

  const DeleteFile = async () => {
    const res = await fetch(`${url}/FileData`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        id: _id,
      }),
    });
    const response = await res.json();
    if(response.status === 200) {
      dispatch(UpdateTree({
        data: {
          Target: _id,
          Root: parent !== null ? PreviousNodesData.Root : _id,
        },
        action: 'delete',
      }));
    }
  };

  useEffect(() => {
    if (_id === FileId) {
      if (!NewFileOption) {
        dispatch(InitialFileName({ FileName, Icon: icon }));
        dispatch(CurrentFileName({ FileName, Icon: icon }));
      }
      dispatch(ChangeCurrentFileId(_id));
      if(parent === null) {
        dispatch(UpdateCurrentFilePath({ path: FileName, Root: _id }));
      } else{
        dispatch(UpdateCurrentFilePath({ path: `${PreviousNodesData.Path}  /  ${FileName}`, Root: PreviousNodesData.Root }));
      }
    }
  }, [FileId]);

  function FileDetailsToRender() {
    if(NewFileOption === true || (CurrentFileId !== _id && NewFileOption === false)) {
      return { fileName: FileName, Icon: icon };
    } else if(CurrentFileId === _id && NewFileOption === false) {
      return { fileName: CurrentFileDetails.FileName, Icon: CurrentFileDetails.Icon };
    } else if(CurrentFileDetails.FileName === '') {
      return { fileName: 'Untitled', Icon: '📄' };
    }
  }

  const FileDetails = FileDetailsToRender();
  const { fileName, Icon } = FileDetails;

  return (
    <>

      <div className={styles.individual_doc_wrap} style={FileId === _id ? { background: '#F1F1F0' } : {}}>

        {/* this div used to cover the whole page when user is checking the options
        it is not visible tho but stops users from clicking anywhere else */}
        <div
          className={styles.overlay_container}
          style={ShowOptions || NewFileName.IsOpen ? { width: '100vw', height: '100vh' } : { width: '0vw', height: '0vh' }}
          onClick={() => {
            if(ShowOptions) {
              setShowOptions(false);
            } else if(NewFileName.IsOpen) {
              setNewFileName({ IsOpen: false, value: '' });
              if(NewFileName.value !== '') {
                dispatch(ChangeCurrentFileId(_id));
                dispatch(CurrentFileName({ FileName: NewFileName.value, Icon }));
                UpdateFileData({ NewFileName: NewFileName.value, NewIcon: null }, 'FileName');
              }
            }
          }}
        />
        <Link
          to={`/${_id}`}
          id={styles.file_link}
        >
          <div className={styles.individual_doc} style={{ marginLeft: `${margin}rem` }}>
            <div className={styles.left_comps}>
              <div
                className={styles.edit_file_option}
                onClick={(e) => { e.preventDefault(); setexpand(!expand); }}
              >
                {
                expand
                  ? <KeyboardArrowDownIcon fontSize={IconSize} htmlColor={ArrowColor} />
                  : <KeyboardArrowRightIcon fontSize={IconSize} htmlColor={ArrowColor} />
                }
              </div>
              <div className={styles.edit_file_option}>
                <span
                  id={styles.emoji}
                  onClick={(e) => {
                    // this prevent default stops the emoji picker
                    // from flickering when you click on anything other than emojis
                    e.preventDefault();
                    if (e.target.nodeName === 'IMG' || e.target.nodeName === 'SPAN') {
                      setShowEmojiPicker(!ShowEmojiPicker);
                    }
                  }}
                >
                  {Icon}
                  <Suspense fallback={<div />}>
                    {ShowEmojiPicker && (
                    <div
                      id={styles.emoji_picker}
                      onClick={(e) => {
                        e.preventDefault();
                        if (e.target.nodeName === 'IMG') {
                          setShowEmojiPicker(false);
                        }
                      }}
                    >
                      <LazyEmojiPicker
                        onEmojiClick={(e) => {
                          dispatch(ChangeCurrentFileId(_id));
                          dispatch(CurrentFileName({ FileName, Icon: e.emoji }));
                          UpdateFileData({ NewFileName: null, NewIcon: e.emoji }, 'icon');
                        }}
                      />
                    </div>
                    )}
                  </Suspense>
                </span>

              </div>
              <div style={FileId === _id ? { color: 'black' } : {}}>
                {fileName}
              </div>
            </div>
            <div
              className={styles.right_comps}
            >

              <div className={styles.option_icon_wrap}>
                <div
                  id={styles.Note_options}
                  onClick={(e) => { e.preventDefault(); }}
                  className={`${styles.Note_options} ${styles.edit_file_option}`}
                >
                  <MoreHorizIcon
                    onClick={() => { setShowOptions(!ShowOptions); }}
                    fontSize={IconSize}
                    htmlColor={IconColor}
                  />
                </div>
                <div id={styles.Note_options} className={`${styles.Note_options} ${styles.edit_file_option}`} onClick={(e) => { e.preventDefault(); }}>
                  <AddIcon
                    onClick={() => {
                      setNewFileOption(true);
                      setexpand(true);
                      dispatch(ChangeCurrentFileId(_id));
                      dispatch(CurrentFileName({ FileName: '', Icon: '📄' }));
                    }}
                    fontSize={IconSize}
                    htmlColor={IconColor}
                  />
                </div>
              </div>

              <div
                id={styles.expand_options_wrap}
                style={{ display: ShowOptions ? 'block' : 'none' }}
                onClick={(e) => {
                  if(e.target.innerText === 'Rename' || e.target.innerText === 'Delete') {
                    setShowOptions(false);
                  }
                }}
              >
                <div id={styles.expand_options}>
                  <div className={styles.expand_options_comps} onClick={() => { DeleteFile(); }}>
                    <DeleteOutlineOutlined fontSize={IconSize} />
                    Delete
                  </div>
                  <div className={styles.expand_options_comps} onClick={() => { setNewFileName({ ...NewFileName, IsOpen: true }); }}>
                    <DriveFileRenameOutline fontSize={IconSize} />
                    Rename
                  </div>
                </div>
              </div>
              <div id={styles.new_file_dialog_wrap} style={NewFileName.IsOpen ? { display: 'block' } : { display: 'none' }}>
                <input
                  type="text"
                  id={styles.new_file_dialog}
                  value={NewFileName.value}
                  onChange={(e) => { setNewFileName({ ...NewFileName, value: e.target.value }); }}
                />
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div>
        <div style={{ display: expand === false ? 'none' : 'block' }}>
          {
            data.children === undefined || data.children.length === 0
              ? <div id={styles.empty_page} style={{ marginLeft: `${margin + 2}rem` }}>No pages inside</div>
              : data.children.map((elem) => (
                <div>

                  {/* Here margin is being sent as a prop so that it can
                  be sent inside the child of parent div as a margin value because otherwise
                  if user will hover on the element then the hover background will also start with
                  the margined element and not from the beginning
                  */}
                  <IndividualFiles
                    key={_id}
                    data={elem}
                    PreviousNodesData={propValue}
                    margin={margin === 0 ? 1.5 : margin + 1.5}
                  />
                </div>
              ))
            }
          {NewFileOption
            ? (
              <div style={{ marginLeft: `${margin + 2}rem` }}>
                <div className={styles.left_comps}>
                  <div className={styles.edit_file_option}>
                    <KeyboardArrowRightIcon fontSize={IconSize} htmlColor={ArrowColor} />
                  </div>
                  <div className={styles.edit_file_option}>
                    {CurrentFileDetails.Icon}
                  </div>
                  <div>
                    {
                      CurrentFileDetails.FileName === ''
                        ? 'Untitled'
                        : CurrentFileDetails.FileName
                    }
                  </div>
                </div>
              </div>
            )
            : ''}
        </div>
      </div>

      {
        NewFileOption
          ? (
            <Modal
              open
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              id={styles.modal}
            >
              <div id={styles.modal_wrap}>
                {/* added this IndividualFileData prop so
                that editor can use the default props from there */}
                <Editor
                  source="new"
                  Root={parent !== null ? PreviousNodesData.Root : _id}
                  IndividualFileData={{ CoverPhoto: null, values: [], id: _id }}
                  CloseNewFileBox={handleClose}
                />
              </div>
            </Modal>

          )
          : ''
      }

    </>

  );
}

IndividualFiles.defaultProps = {
  margin: 0,
  PreviousNodesData: null,
};

export default IndividualFiles;
