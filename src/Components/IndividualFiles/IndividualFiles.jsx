/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'; import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { DeleteOutlineOutlined, DriveFileRenameOutline, ContentCopy } from '@mui/icons-material';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './IndividualFiles.module.css';
import Editor from '../Editor/Editor';
import { CurrentFileId } from '../../Redux/ExplorerSlice';

function IndividualFiles({ data, margin }) {
  const CurrentFile = useSelector((state) => state.ExplorerDetails.current_id);
  const { FileName, _id } = data;
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Change Icon
    </Tooltip>
  );

  // const [test, settest] = useState(null);

  // useEffect(() => {
  //   if (CurrentFile == _id && CurrentFile != null) {
  //     settest('worked');
  //   }
  // }, [CurrentFile]);

  const dispatch = useDispatch();
  const IconConfig = { IconSize: 'small', IconColor: '#5A5A57', ArrowColor: '#636363' };
  const { IconSize, IconColor, ArrowColor } = IconConfig;

  const [expand, setexpand] = useState(false);
  const [ShowOptions, setShowOptions] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const url = import.meta.env.VITE_URL;

  const AddFile = async () => {
    const res = await fetch(`${url}/AddFile`, {
      method: 'POST',
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

  return (
    <>
      <div className={styles.individual_doc_wrap}>
        <Link to={_id} id={styles.file_link}>

          <div className={styles.individual_doc} style={{ marginLeft: `${margin}rem` }}>
            <div className={styles.left_comps}>
              <div className={styles.edit_file_option} onClick={() => { setexpand(!expand); }}>
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
                    😂
                  </div>
                </OverlayTrigger>
              </div>
              <div>{FileName}</div>
            </div>
            <div
              className={styles.right_comps}
              onMouseLeave={() => {
                if (ShowOptions) {
                  setShowOptions(!ShowOptions);
                }
              }}
            >
              <div id={styles.Note_options} className={`${styles.Note_options} ${styles.edit_file_option}`}>
                <MoreHorizIcon
                  onClick={() => { setShowOptions(!ShowOptions); }}
                  fontSize={IconSize}
                  htmlColor={IconColor}
                />
              </div>
              <div id={styles.Note_options} className={`${styles.Note_options} ${styles.edit_file_option}`}>
                <AddIcon
                  onClick={() => {
                    dispatch(CurrentFileId(_id));
                    setShow(true);
                  }}
                  fontSize={IconSize}
                  htmlColor={IconColor}
                />
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
            data.Items === undefined || data.Items.length === 0
              ? <div id={styles.empty_page} style={{ marginLeft: `${margin + 2}rem` }}>No pages inside</div>
              : data.Items.map((elem) => (
                <div>
                  {/* Here margin is being sent as a prop because if I set the margin right here then the whole div will be moved forward and it will create problems when user will hover on it and if i directly put 2 rem in the rendered div then all the files will be on same level so i passed it as a prop and incrementing it according to the level of nest */}
                  <IndividualFiles data={elem} margin={margin === 0 ? 1.5 : margin + 1.5} />
                </div>
              ))
            }
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
