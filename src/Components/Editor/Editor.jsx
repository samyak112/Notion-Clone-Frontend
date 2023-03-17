import React, { useEffect, useState } from 'react';
import { ImageRounded, SentimentSatisfiedAlt } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Editor.module.css';
import { CurrentFileName } from '../../Redux/ExplorerSlice';

function Editor({ IndividualFileData }) {
  const CurrentFileDetails = useSelector((state) => state.ExplorerDetails.CurrentValue);
  const { CoverPhoto, values } = IndividualFileData;
  const [blocks, setblocks] = useState(null);
  const { FileName, Icon } = CurrentFileDetails;
  const [DraggingDetails, setDraggingDetails] = useState({
    Started: false, source: null, destination: null,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    setblocks(values);
  }, [values]);

  function InitiateDragging(index) {
    setDraggingDetails({
      ...DraggingDetails, Started: true, source: index,
    });
  }

  function StopDragging() {
    setDraggingDetails({ ...DraggingDetails, Started: false });
  }

  function TrackDraggedElement(index) {
    if (DraggingDetails.Started === false) {
      setDraggingDetails({ ...DraggingDetails, destination: index });
    }
  }

  return (
    <div id={styles.main}>

      <div id={styles.top}>
        <div id={styles.cover_photo} style={CoverPhoto == null ? { height: '8rem' } : { height: '14rem' }}>
          <div id={styles.cover_image_wrap}>
            {
              CoverPhoto != null
                ? <img id={styles.image} src={CoverPhoto} alt="" />
                : ''
            }
          </div>
        </div>
        <div id={styles.centered_area_wrap}>
          <div id={styles.centered_area_inner_wrap}>
            <div id={styles.emoji}>{Icon}</div>
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
            <input className={styles.input_field} value={FileName} onChange={(e) => { dispatch(CurrentFileName({ ...CurrentFileDetails, FileName: e.target.value })); }} type="text" placeholder="Untitled" />
          </div>
          <div className={styles.editor_comps} id={styles.content}>
            {
            blocks != null
              ? blocks.map((elem, index) => (
                <div
                  contentEditable="true"
                  draggable
                  onDragEnter={() => { TrackDraggedElement(index); }}
                  onDragStart={() => { InitiateDragging(index); }}
                  onDragEnd={() => { StopDragging(index); }}
                >
                  {elem.value}
                </div>
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
