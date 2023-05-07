/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Add, DragIndicator } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import diff from 'fast-diff';
import Checkbox from '@mui/material/Checkbox';
import styles from './Blocks.module.css';
import { ChangeTrackingDetails } from '../../Redux/ElementTrack';
import BlockStyles from './BlockStyle';
import BlockOptionsData from './BlockOptionsData';
import BasicOptions from '../BlockOptions/BasicOptions';
import ColorOptions from '../BlockOptions/ColorOptions';
import DragOptions from '../BlockOptions/DragOptions';

function Blocks({
  BlockData, UpdateBlocks, DeleteBlock, UpdateBlockStyle, NumberedListCount, ChangeBlockPosition,
}) {
  const dispatch = useDispatch();
  const { BlockColors, BlockBackground } = BlockOptionsData;

  // Props data
  const { index, elem } = BlockData;
  const {
    value, style, _id, color, background,
  } = elem;

  console.log(style);

  // states
  const [isDragging, setisDragging] = useState(null);
  const [ElementValue, setElementValue] = useState(value);
  const [OpenBlockStyleOptions, setOpenBlockStyleOptions] = useState({
    state: false, IsSlashCommand: false, IsTurnInTo: false,
  });
  const [OpenBlockChangeOptions, setOpenBlockChangeOptions] = useState(false);

  // Ref
  const IsEdited = useRef(null);
  const LastCharChange = useRef(null);

  // Redux
  const DraggingDetails = useSelector((state) => state.TrackingDetails.DraggingDetails);
  const { current, direction } = DraggingDetails;

  // used to limit unnecessary responses being sent to parent
  // component just because onblur was fired but the user didnt even changed anything
  function HandleInput(e) {
    const Currentvalue = e.target.innerText;

    // Nodename is added for checkbox because
    // these functions are triggered by clicking on this too because of event bubbling
    const NodeName = e.target.nodeName;
    const CurrentChar = e.nativeEvent.data;

    // had to speicfy IsEdited so that update block
    // doesnot send data only because on blur was triggered
    if (IsEdited.current !== true) {
      IsEdited.current = true;
    }

    if (Currentvalue.length === 0 && NodeName !== 'INPUT') {
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
    const CurrentValue = e.target.innerText;
    const CommonPayload = {
      IsNewBlock: true, IsDuplicate: false, index,
    };
    if (source === 'Duplicate') {
      if (style === 'to_do_list') {
        UpdateBlocks({
          IsNewBlock: true, IsDuplicate: true, value: ElementValue, index, isChecked: false, style,
        });
      } else {
        UpdateBlocks({
          IsNewBlock: true, IsDuplicate: true, value: ElementValue, index, style,
        });
      }
    } else if (source === 'Add') {
      if (ElementValue.length !== 0) {
        UpdateBlocks({ ...CommonPayload, style: 'text' });
      } else {
        setOpenBlockStyleOptions({ ...OpenBlockStyleOptions, state: true });
      }
    } else if (source === 'Enter') {
      if ((e.code === 'Enter' && CurrentValue.length === 0) || (e.code === 'Enter' && e.shiftKey === false && ElementValue.length !== 0 && ElementValue !== '')) {
        e.preventDefault();
        if (style === 'to_do_list') {
          UpdateBlocks({
            ...CommonPayload, style, isChecked: false,
          });
        } else if (style === 'bullet_list' || style === 'number_list') {
          UpdateBlocks({ ...CommonPayload, style });
        } else {
          UpdateBlocks({
            ...CommonPayload, style: 'text',
          });
        }
      }
    }
  }

  function ChangeBlockStyle(BlockValue) {
    let payload = null;
    const CommonPayload = {
      _id, value: ElementValue, style: BlockValue, color, background,
    };

    if (BlockValue === 'to_do_list') {
      payload = {
        BlockData: {
          isChecked: false, ...CommonPayload,
        },
        index,
      };
    } else {
      payload = {
        BlockData: {
          ...CommonPayload,
        },
        index,
      };
    }
    UpdateBlockStyle(payload);
    setOpenBlockStyleOptions({ ...OpenBlockStyleOptions, state: false });
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

  function BeforePsuedoValueToRender() {
    switch (style) {
      case 'bullet_list':
        return { '--content--var': '"•"' };
      case 'number_list':
        return { '--content--var': `"${NumberedListCount}."` };
      default:
        break;
    }
  }

  function NewElementPositionHighlight() {
    const CommonPayload = { color, background };
    if (current === index) {
      return { borderTop: '2px solid #65a6e4', ...CommonPayload };
    }
    return { ...CommonPayload };
  }

  function TrackDraggedElement(ElementLocation) {
    dispatch(ChangeTrackingDetails({ key: 'current', value: ElementLocation }));
    if (current > ElementLocation) {
      if (direction !== 'up') {
        dispatch(ChangeTrackingDetails({ key: 'direction', value: 'up' }));
      }
    } else if (current < ElementLocation) {
      if (direction !== 'down') {
        dispatch(ChangeTrackingDetails({ key: 'direction', value: 'down' }));
      }
    }
  }

  function StopDragging() {
    dispatch(ChangeTrackingDetails({ key: 'current', value: null }));
    setisDragging(false);
    ChangeBlockPosition({
      NewIndex: current, CurrentIndex: index, data: elem, direction,
    });
  }

  function Moving() {
    if (isDragging !== true) {
      setisDragging(true);
    }
  }

  return (
    <div
      className={styles.main}
      style={BlockStyles[0][style].style}
      draggable={isDragging}
      onDragEnter={() => { TrackDraggedElement(index); }}
      onDragEnd={() => { StopDragging(); }}
    >
      <div
        className={styles.overlay_container}
        style={OpenBlockChangeOptions || OpenBlockStyleOptions.state ? { width: '100vw', height: '100vh' } : { width: '0vw', height: '0vh' }}
        onClick={() => { CloseOptions(); }}
      />
      {/* BLock Options */}
      <div
        className={styles.options}
        style={OpenBlockStyleOptions.state || OpenBlockChangeOptions ? { display: 'none' } : { display: 'flex' }}
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
      <div
        className={styles.content_blocks}
        // draggable
        contentEditable
        onBlur={(e) => { UpdateBlockValue(e); }}
        onInput={HandleInput}
        onKeyDown={(e) => { AddNewBlock('Enter', e); }}
        style={NewElementPositionHighlight()}

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
            : (
              <div className={styles.block_wrap}>
                <div
                  className={styles.before_value}
                  contentEditable={false}
                  style={BeforePsuedoValueToRender()}
                />
                {/* made another div for placeholder because otherwise it wasnt
                considered as empty and placeholder is only available when div is empty */}
                <div
                  placeholder={BlockStyles[0][style].name === 'Text' ? 'Press / for commands' : BlockStyles[0][style].name}
                  className={styles.element_value}
                >
                  {value}
                </div>
              </div>
            )
        }
      </div>

      {/* Block Design Options div */}
      <div
        id={styles.block_options}
        style={OpenBlockStyleOptions.state ? { display: 'block', fontSize: '1rem' } : { display: 'none' }}
      >
        <BasicOptions
          style={style}
          ChangeBlockStyle={ChangeBlockStyle}
        />

        {
          (OpenBlockStyleOptions.state === true && OpenBlockStyleOptions.IsSlashCommand === true)
          || (OpenBlockStyleOptions.state === true && OpenBlockStyleOptions.IsTurnInTo === true)
            ? (
              <>
                <ColorOptions Heading="Color" MappedData={BlockColors} ChangeBlockColor={ChangeBlockColor} />
                <ColorOptions Heading="Background" MappedData={BlockBackground} ChangeBlockColor={ChangeBlockColor} />
              </>
            )
            : ''
        }
      </div>

      {/* Drag button Options */}
      <div
        className={styles.drag_options}
        style={OpenBlockChangeOptions ? { display: 'block', fontSize: '1rem' } : { display: 'none' }}
      >
        <DragOptions
          AddNewBlock={AddNewBlock}
          ChangeBlockStyle={ChangeBlockStyle}
          ChangeBlockColor={ChangeBlockColor}
          DeleteBlock={DeleteBlock}
          index={index}
        />
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
