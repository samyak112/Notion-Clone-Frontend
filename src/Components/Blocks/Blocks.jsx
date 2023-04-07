/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Add, DragIndicator } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import diff from 'fast-diff';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined'; import styles from './Blocks.module.css';
import { ChangeTrackingDetails } from '../../Redux/ElementTrack';
import BlockStyles from './BlockStyle';
import BlockOptionsData from './BlockOptionsData';

function Blocks({ BlockData, UpdateBlocks, DeleteBlock }) {
  const dispatch = useDispatch();
  const { BasicBlocks, BlockColors, BlockBackground } = BlockOptionsData;

  // Props data
  const { index, elem } = BlockData;
  const { value, style, _id } = elem;

  // states
  const DraggingDetails = useSelector((state) => state.TrackingDetails.DraggingDetails);
  const { current, direction } = DraggingDetails;
  const [isDragging, setisDragging] = useState(null);
  const [ElementValue, setElementValue] = useState(value);
  const [OpenBlockStyleOptions, setOpenBlockStyleOptions] = useState({
    state: false, IsSlashCommand: false, IsTurnInTo: false,
  });
  const [OpenBlockChangeOptions, setOpenBlockChangeOptions] = useState(false);

  // Ref
  const IsEdited = useRef(null);
  const LastCharChange = useRef(null);

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

  // used to limit unnecessary responses being sent to parent
  // component just because onblur was fired but the user didnt even changed anything
  function HandleInput(e) {
    const Currentvalue = e.target.innerText;
    const NodeName = e.target.nodeName;
    const CurrentChar = e.nativeEvent.data;
    if (IsEdited.current !== true) {
      IsEdited.current = true;
    }

    if (Currentvalue === '' && NodeName !== 'INPUT') {
      DeleteBlock(index);
    }

    // gets the latest character pressed
    if (CurrentChar === '/') {
      setOpenBlockStyleOptions({
        ...OpenBlockStyleOptions,
        state: !OpenBlockStyleOptions.state,
        IsSlashCommand: !OpenBlockStyleOptions.IsSlashCommand,
      });
    }

    if (CurrentChar === null && LastCharChange.current === '/') {
      if (OpenBlockStyleOptions.state !== false && OpenBlockStyleOptions.IsSlashCommand !== false) {
        setOpenBlockStyleOptions({
          ...OpenBlockStyleOptions,
          state: false,
          IsSlashCommand: false,
        });
      }
    }
    setElementValue(Currentvalue);
    LastCharChange.current = Currentvalue[Currentvalue.length - 1];
  }

  function UpdateBlockValue(e) {
    // console.log(e)
    if (e.target.nodeName !== 'INPUT') {
      if (IsEdited.current === true) {
        // console.log('entered here bitch');
        const payload = {
          _id, value: e.target.innerText, index, IsNewBlock: false,
        };
        if (ElementValue.length !== value.length) {
          // if the length is different then we dont need to check for changes because different
          //  length is itself the biggest indication of change
          UpdateBlocks(payload);
        } else {
        // Using diff algorithm to check if the string has any change? If not there
        // is no need for re rendering the whole state again
          const changes = diff(value, ElementValue);
          const response = changes.some(([tag]) => tag !== 0);
          if (response === true) {
            UpdateBlocks(payload);
          }
        }
        IsEdited.current = false;
      }
      if (OpenBlockStyleOptions === true) {
        setOpenBlockStyleOptions({ ...OpenBlockStyleOptions, state: false });
      }
    }
  }

  function CloseOptions() {
    if (OpenBlockStyleOptions.state) {
      setOpenBlockStyleOptions({ ...OpenBlockStyleOptions, state: false });
    }
    if (OpenBlockChangeOptions) {
      setOpenBlockChangeOptions(false);
    }
  }

  function AddNewBlock(source, e) {
    if (ElementValue.length !== 0 && ElementValue !== '\u00A0') {
      if (source === 'Enter') {
        if (e.code === 'Enter' && e.shiftKey === false) {
          e.preventDefault();
          if (style === 'to_do_list') {
            UpdateBlocks({
              IsNewBlock: true, index, value: '\u00A0', style: 'to_do_list', isChecked: true,
            });
          } else {
            UpdateBlocks({
              IsNewBlock: true, index, value: '\u00A0', style: 'text',
            });
          }
        }
      } else {
        UpdateBlocks({
          IsNewBlock: true, index, value: '\u00A0', style: 'text',
        });
      }
    } else if (source === 'Add') {
      setOpenBlockStyleOptions({ ...OpenBlockStyleOptions, state: !OpenBlockStyleOptions.state });
    }
  }

  function UpdateCheckbox(e) {
    const isChecked = e.target.checked;
    const payload = {
      _id, index, IsNewBlock: false, isChecked,
    };
    UpdateBlocks(payload, 'checkbox');
  }

  // function NewElementPositionHighlight() {
  //   const borderStyle = null;
  //   if (current === index) {
  //     if (direction === 'up') {
  //       return {
  //         borderTop: '2px solid #65a6e4',
  //       };
  //     }
  //     if (direction === 'down') {
  //       return {
  //         borderBottom: '2px solid #65a6e4',
  //       };
  //     }
  //   }
  // }

  return (
    <div className={styles.main} style={BlockStyles[0][style].style}>
      <div
        className={styles.overlay_container}
        style={OpenBlockChangeOptions || OpenBlockStyleOptions.state ? { width: '100vw', height: '100vh' } : { width: '0vw', height: '0vh' }}
        onClick={() => { CloseOptions(); }}
      />
      <div
        className={styles.content_blocks}
        placeholder={BlockStyles[0][style].name === 'Text' ? 'Press / for commands' : BlockStyles[0][style].name}
        contentEditable
        draggable={isDragging}
        onDragStart={() => { InitiateDragging(index); }}
        onDragEnter={() => { TrackDraggedElement(index); }}
        onDragEnd={() => { StopDragging(); }}
        onBlur={(e) => {
          UpdateBlockValue(e);
          CloseOptions();
        }}
        onClick={() => { CloseOptions(); }}
        onInput={HandleInput}
        onKeyDown={(e) => { AddNewBlock('Enter', e); }}
      >

        {
          style === 'to_do_list'
            ? (
              <>
                <div contentEditable={false}>
                  <input onClick={(e) => { UpdateCheckbox(e); }} type="checkbox" id={styles.check_box} name="checkbox" />
                </div>
                <label htmlFor="check_box" className={styles.element_value} style={elem.isChecked ? { textDecoration: 'line-through rgba(55, 53, 47, 0.25)' } : { textDecoration: 'none' }}>
                  {value}
                </label>
              </>
            )
            : (
              <div className={styles.element_value}>
                {value}
              </div>
            )
        }
      </div>

      {/* Block Design Options div */}
      <div
        id={styles.block_options}
        style={OpenBlockStyleOptions.state ? { display: 'block' } : { display: 'none' }}
      >
        <div className={styles.option_heading}>
          Basic Block
        </div>
        {
          BasicBlocks.map((item) => (
            <div className={styles.basic_block}>
              <div className={styles.block_icon}>
                {' '}
                <img id={styles.actual_image} src={item.icon} alt="" />
              </div>
              <div className={styles.block_text}>
                <div className={styles.text}>{item.Heading}</div>
                <div className={styles.description}>{item.Description}</div>
              </div>
            </div>
          ))
        }

        {
          (OpenBlockStyleOptions.state === true && OpenBlockStyleOptions.IsSlashCommand === true)
          || (OpenBlockStyleOptions.state === true && OpenBlockStyleOptions.IsTurnInTo === true)
            ? (
              <>
                <div className={styles.option_heading}>
                  Color
                </div>
                {BlockColors.map((item) => (
                  <div className={styles.basic_block}>
                    <div className={styles.block_icon} style={{ color: item.color }}>
                      {' '}
                      A
                    </div>
                    <div className={styles.block_text}>
                      <div className={styles.text}>{item.Heading}</div>
                    </div>
                  </div>
                ))}
                <div className={styles.option_heading}>
                  Background
                </div>
                {BlockBackground.map((item) => (
                  <div className={styles.basic_block}>
                    <div className={styles.block_icon} style={{ background: item.bgcolor }}>
                      {' '}
                      A
                    </div>
                    <div className={styles.block_text}>
                      <div className={styles.text}>{item.Heading}</div>
                    </div>
                  </div>
                ))}
              </>
            )
            : ''
        }
      </div>

      {/* Drag button Options */}
      <div
        className={styles.drag_options}
        style={OpenBlockChangeOptions ? { display: 'block' } : { display: 'none' }}
      >
        <div className={styles.drag_options_comps}>
          <div className={styles.drag_option_icon}><DeleteOutlineOutlinedIcon /></div>
          <div className={styles.drag_option_text}>Delete</div>
        </div>
        <div className={styles.drag_options_comps}>
          <div className={styles.drag_option_icon}><ContentCopyOutlinedIcon /></div>
          <div className={styles.drag_option_text}>Duplicate</div>
        </div>
        <div className={styles.drag_options_comps}>
          <div className={styles.drag_option_icon}><ImportExportOutlinedIcon /></div>
          <div className={styles.drag_option_text}>Turn into</div>
        </div>
        <div className={styles.drag_options_comps}>
          <div className={styles.drag_option_icon}><FormatPaintOutlinedIcon /></div>
          <div className={styles.drag_option_text}>Color</div>
        </div>
      </div>

      {/* BLock Options */}
      <div
        className={styles.options}
        style={OpenBlockStyleOptions.state || OpenBlockChangeOptions ? { display: 'none' } : { display: 'flex' }}
        // onMouseMove={() => { Moving(); }}
        onMouseDown={() => { Moving(); }}
      >
        <div
          className={styles.icons}
          onClick={(e) => { AddNewBlock('Add', e); }}
        >
          <Add />
        </div>
        <div className={styles.icons} onClick={() => { setOpenBlockChangeOptions(true); }}>
          <DragIndicator />
        </div>
      </div>
    </div>
  );
}

Blocks.defaultProps = {
  BlockData: {
    index: 0,
    value: null,
    style: 'text',
  },
};

Blocks.propTypes = {
  BlockData: PropTypes.shape({
    index: PropTypes.number,
    value: PropTypes.string,
    style: PropTypes.string,
  }),
};

export default Blocks;
