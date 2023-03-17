/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { DeleteOutlineOutlined, DriveFileRenameOutline, ContentCopy } from '@mui/icons-material';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import styles from './IndividualFiles.module.css';
import Editor from '../Editor/Editor';
import { CurrentFileId, CurrentFileName, LastUpdatedFileName } from '../../Redux/ExplorerSlice';

function IndividualFiles({ data, margin }) {
  const { FileName, _id, icon } = data;

  const dispatch = useDispatch();
  const { FileId } = useParams();

  const CurrentFileDetails = useSelector((state) => state.ExplorerDetails.CurrentValue);

  const IconConfig = { IconSize: 'small', IconColor: '#5A5A57', ArrowColor: '#636363' };
  const { IconSize, IconColor, ArrowColor } = IconConfig;

  const [expand, setexpand] = useState(false);
  const [ShowOptions, setShowOptions] = useState(false);
  const [NewFileOption, setNewFileOption] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setNewFileOption(false);
    dispatch(CurrentFileName({ FileName, Icon: icon }));
    dispatch(LastUpdatedFileName({ FileName, Icon: icon }));
  };

  const url = import.meta.env.VITE_URL;

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Change Icon
    </Tooltip>
  );

  const AddFile = async () => {
    const res = await fetch(`${url}/AddFile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        FakeData: 'lol',
      }),
    });
    const response = await res.json();
    console.log(response);
  };

  useEffect(() => {
    if (_id === FileId) {
      if (!NewFileOption) {
        dispatch(CurrentFileName({ FileName, Icon: icon }));
        dispatch(LastUpdatedFileName({ FileName, Icon: icon }));
      }
    }
  }, [FileId]);

  function FileNameToRender() {
    if (NewFileOption || _id !== FileId) {
      return FileName;
    }
    if (CurrentFileDetails.FileName === '') {
      return 'Untitled';
    }
    return CurrentFileDetails.FileName;
  }

  return (
    <>

      <div className={styles.individual_doc_wrap} style={FileId === _id ? { background: '#F1F1F0' } : {}}>
        {/* this div used to cover the whole page when user is checking the options
        it is not visible tho but stops users from clicking anywhere else */}
        <div className={styles.overlay_container} style={ShowOptions ? { width: '100vw', height: '100vh' } : { width: '0vw', height: '0vh' }} onClick={() => { setShowOptions(!ShowOptions); }} />
        <Link to={`/${_id}`} id={styles.file_link}>
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
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 50, hide: 50 }}
                  overlay={renderTooltip}
                >
                  <div>
                    {
                    icon === null
                      ? '📄'
                      : icon
                    }
                  </div>
                </OverlayTrigger>
              </div>
              <div style={FileId === _id ? { color: 'black' } : {}}>
                {FileNameToRender()}
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
                <div id={styles.Note_options} className={`${styles.Note_options} ${styles.edit_file_option}`}>
                  <AddIcon
                    onClick={() => {
                      setNewFileOption(true);
                      setexpand(true);
                      setShow(true);
                      dispatch(CurrentFileId(_id));
                      dispatch(CurrentFileName({ FileName: '', Icon: '' }));
                      dispatch(LastUpdatedFileName({ FileName: '', Icon: '' }));
                    }}
                    fontSize={IconSize}
                    htmlColor={IconColor}
                  />
                </div>
              </div>

              <div id={styles.expand_options_wrap} style={{ display: ShowOptions ? 'block' : 'none' }}>
                <div id={styles.expand_options}>
                  <div className={styles.expand_options_comps}>
                    <DeleteOutlineOutlined fontSize={IconSize} />
                    Delete
                  </div>
                  <div className={styles.expand_options_comps}>
                    <ContentCopy fontSize={IconSize} />
                    Duplicate
                  </div>
                  <div className={styles.expand_options_comps}>
                    <DriveFileRenameOutline fontSize={IconSize} />
                    Rename
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div>
        <div style={{ display: expand === false ? 'none' : 'block' }}>
          {
            data.items === undefined || data.items.length === 0
              ? <div id={styles.empty_page} style={{ marginLeft: `${margin + 2}rem` }}>No pages inside</div>
              : data.items.map((elem) => (
                <div>

                  {/* Here margin is being sent as a prop so that it can
                  be sent inside the child of parent div as a margin value because otherwise
                  if user will hover on the element then the hover background will also start with
                  the margined element and not from the beginning
                  */}
                  <IndividualFiles
                    key={_id}
                    data={elem}
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
                    📄
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
        show
          ? (
            <Modal
              open
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              id={styles.modal}
            >
              <div id={styles.modal_wrap}>
                <Editor />
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
};

export default IndividualFiles;
