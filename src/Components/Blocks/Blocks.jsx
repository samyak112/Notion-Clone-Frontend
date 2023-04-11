/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Add, DragIndicator } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import diff from 'fast-diff';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import Checkbox from '@mui/material/Checkbox';
import styles from './Blocks.module.css';
import { ChangeTrackingDetails } from '../../Redux/ElementTrack';
import BlockStyles from './BlockStyle';
import BlockOptionsData from './BlockOptionsData';

function Blocks({
  BlockData, UpdateBlocks, DeleteBlock, UpdateBlockStyle,
}) {
  const dispatch = useDispatch();
  const { BasicBlocks, BlockColors, BlockBackground } = BlockOptionsData;

  // Props data
  const { index, elem } = BlockData;
  const {
    value, style, _id, color, bgcolor,
  } = elem;

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

    // had to speicfy IsEdited so that update block
    // doesnot send data only because on blur was triggered
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
        state: true,
        IsSlashCommand: true,
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
    if (e.target.nodeName !== 'INPUT') {
      if (IsEdited.current === true) {
        const payload = {
          _id, value: e.target.innerText, index, IsNewBlock: false, style,
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
    if (source === 'Duplicate') {
      UpdateBlocks({
        IsNewBlock: true, IsDuplicate: true, value: ElementValue, index, style,
      });
    } else if (ElementValue.length !== 0 && ElementValue !== '\u00A0') {
      if (source === 'Enter') {
        if (e.code === 'Enter' && e.shiftKey === false) {
          e.preventDefault();
          if (style === 'to_do_list') {
            UpdateBlocks({
              IsNewBlock: true, IsDuplicate: false, index, style: 'to_do_list', isChecked: true,
            });
          } else if (style === 'bullet_list') {
            UpdateBlocks({
              IsNewBlock: true, IsDuplicate: false, index, style: 'bullet_list',
            });
          } else {
            UpdateBlocks({
              IsNewBlock: true, IsDuplicate: false, index, style,
            });
          }
        }
      } else {
        UpdateBlocks({
          IsNewBlock: true, IsDuplicate: false, index, style: 'text',
        });
      }
    } else if (source === 'Add') {
      if (!OpenBlockStyleOptions.state) {
        setOpenBlockStyleOptions({ ...OpenBlockStyleOptions, state: true });
      }
    }
  }

  function ChangeBlockStyle(BlockValue) {
    let payload = null;
    if (BlockValue === 'to_do_list') {
      payload = {
        IsNewBlock: false, isChecked: false, style: BlockValue, index, value: ElementValue, _id,
      };
    } else {
      payload = {
        IsNewBlock: false, style: BlockValue, index, value: ElementValue, _id,
      };
    }
    UpdateBlockStyle(payload);
    // const payload = { _id, IsNewBlock: true };
  }

  function ChangeBlockColor(ColorValue, type) {
    UpdateBlocks({
      ColorValue, index, IsNewBlock: false, value, _id,
    }, type);
    setOpenBlockStyleOptions({ ...OpenBlockStyleOptions, state: false });
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
        draggable={isDragging}
        contentEditable
        onDragStart={() => { InitiateDragging(index); }}
        onDragEnter={() => { TrackDraggedElement(index); }}
        onDragEnd={() => { StopDragging(); }}
        onBlur={(e) => { UpdateBlockValue(e); }}
        onInput={HandleInput}
        onKeyDown={(e) => { AddNewBlock('Enter', e); }}
        style={{ color, background: bgcolor }}
      >

        {
          style === 'to_do_list'
            ? (
              <>
                {/* added content editable false in checkbox so that block gets
                deleted when the checkmark is tried to be removed */}
                <div className={styles.checkbox_wrap}>
                  <Checkbox
                    style={{ height: 'fit-content', padding: '0px' }}
                    onClick={(e) => { UpdateCheckbox(e); }}
                    checked={elem.isChecked}
                    contentEditable={false}
                  />
                  <div
                    style={
                      elem.isChecked
                        ? { textDecoration: 'line-through rgba(55, 53, 47, 0.25)' }
                        : { textDecoration: 'none' }
                      }
                    className={styles.element_value}
                  >
                    {value}
                  </div>
                </div>
              </>
            )
            : style === 'bullet_list'
              ? (
            // here i didnt added the value directly in li tag for two reasons
            // 1. color was interferin with the bulled too as the color is coming from parent div
            // so it gets applied to bullet too and not just the value
            // 2. wasnt able to make only the ul tag content editable false alone it was
            //  causing the li value to be non editable because of that

                <div className={styles.bullet}>
                  <ul contentEditable={false} style={{ color: 'black', margin: '0px' }}><li /></ul>
                  <div className={styles.element_value}>{value}</div>
                </div>
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
        style={OpenBlockStyleOptions.state ? { display: 'block', fontSize: '1rem' } : { display: 'none' }}
      >
        <div className={styles.option_heading}>
          Basic Block
        </div>
        {
          BasicBlocks.map((item) => (
            <div
              className={styles.basic_block}
              onClick={() => {
                ChangeBlockStyle(item.value, style);
                setOpenBlockStyleOptions({ ...OpenBlockStyleOptions, state: false });
              }}
            >
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
                  <div className={styles.basic_block} onClick={() => { ChangeBlockColor(item.color, 'color'); }}>
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
                  <div className={styles.basic_block} onClick={() => { ChangeBlockColor(item.bgcolor, 'bgcolor'); }}>
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
        <div className={styles.drag_options_comps} onClick={() => { DeleteBlock(index); }}>
          <div className={styles.drag_option_icon}><DeleteOutlineOutlinedIcon /></div>
          <div className={styles.drag_option_text}>Delete</div>
        </div>
        <div className={styles.drag_options_comps} onClick={(e) => { AddNewBlock('Duplicate', e); }}>
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
