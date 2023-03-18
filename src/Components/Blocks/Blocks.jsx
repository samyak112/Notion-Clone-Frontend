import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Add, DragIndicator } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Blocks.module.css';
import { ChangeTrackingDetails } from '../../Redux/ElementTrack';

function Blocks({ BlockData }) {
  const dispatch = useDispatch();
  const { index, value } = BlockData;
  const DraggingDetails = useSelector((state) => state.TrackingDetails.DraggingDetails);
  const { current, direction } = DraggingDetails;
  const [isDragging, setisDragging] = useState(null);

  function InitiateDragging(ElementLocation) {
    dispatch(ChangeTrackingDetails({ key: 'Started', value: true }));
    dispatch(ChangeTrackingDetails({ key: 'source', value: ElementLocation }));
  }

  function TrackDraggedElement(ElementLocation) {
    dispatch(ChangeTrackingDetails({ key: 'current', value: ElementLocation }));
  }

  function StopDragging() {
    dispatch(ChangeTrackingDetails({ key: 'Started', value: false }));
    dispatch(ChangeTrackingDetails({ key: 'destination', value: current }));
    setisDragging(false);
  }

  function Moving() {
    if (isDragging !== true) {
      setisDragging(true);
    }
  }

  return (
    <div
      className={styles.content_blocks}
      draggable={isDragging}
      onDragStart={() => { InitiateDragging(index); }}
      onDragEnter={() => { TrackDraggedElement(index); }}
      onDragEnd={() => { StopDragging(); }}
    >
      <div className={styles.options} onMouseMove={() => { Moving(); }}>
        <Add />
        <DragIndicator />
      </div>

      {value}
    </div>
  );
}

Blocks.defaultProps = {
  BlockData: {
    index: 0,
    value: null,
  },
};

Blocks.propTypes = {
  BlockData: PropTypes.shape({
    index: PropTypes.number,
    value: PropTypes.string,
  }),
};

export default Blocks;
