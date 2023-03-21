/* eslint-disable no-console */
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
  // const CLientY = useRef(null);

  function InitiateDragging(ElementLocation) {
    dispatch(ChangeTrackingDetails({ key: 'Started', value: true }));
    dispatch(ChangeTrackingDetails({ key: 'source', value: ElementLocation }));
  }

  function TrackDraggedElement(ElementLocation) {
    console.log({ current, ElementLocation });
    dispatch(ChangeTrackingDetails({ key: 'current', value: ElementLocation }));
    if (current > ElementLocation) {
      if (direction !== 'up') {
        // console.log('up', { current, ElementLocation });
        dispatch(ChangeTrackingDetails({ key: 'direction', value: 'up' }));
      }
    } else if (current < ElementLocation) {
      if (direction !== 'down') {
        // console.log('down', { current, ElementLocation });

        dispatch(ChangeTrackingDetails({ key: 'direction', value: 'down' }));
      }
    }
  }

  function StopDragging() {
    dispatch(ChangeTrackingDetails({ key: 'Started', value: false }));
    dispatch(ChangeTrackingDetails({ key: 'destination', value: current }));
    dispatch(ChangeTrackingDetails({ key: 'current', value: null }));
    setisDragging(false);
  }

  function Moving() {
    if (isDragging !== true) {
      setisDragging(true);
    }
  }

  function NewElementPositionHighlight() {
    if (current === index) {
      if (direction === 'up') {
        return {
          borderTop: '2px solid #65a6e4',
        };
      }
      if (direction === 'down') {
        return {
          borderBottom: '2px solid #65a6e4',
        };
      }
    }
  }

  return (
    <div
      className={styles.content_blocks}
      style={NewElementPositionHighlight()}
      draggable={isDragging}
      onDragStart={() => { InitiateDragging(index); }}
      onDragEnter={() => { TrackDraggedElement(index); }}
      onDragEnd={() => { StopDragging(); }}
    >
      <div
        className={styles.options}
        // onMouseMove={() => { Moving(); }}
        onMouseDown={() => { Moving(); }}
      >
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
