/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import styles from './Editor.module.css';
import { InitialFileName, ChangeCurrentFileId, CurrentFileName } from '../../Redux/ExplorerSlice';
import EditorTop from '../EditorTop/EditorTop';
import Blocks from '../Blocks/Blocks';

function Editor({ IndividualFileData, source }) {
  // redux
  const CurrentFileDetails = useSelector((state) => state.ExplorerDetails.CurrentValue);
  const InitialFileDetails = useSelector((state) => state.ExplorerDetails.InitialValues);
  const CurrentFileId = useSelector((state) => state.ExplorerDetails.current_id);

  // states
  const [blocks, setblocks] = useState([]);
  console.log(blocks);
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
  const NumberedListCount = useRef(0);

  // destructured props
  const { FileName, Icon } = CurrentFileDetails;
  const { CoverPhoto, values, ref_id } = IndividualFileData;
  const dispatch = useDispatch();

  function FileDetailsToRender() {
    if (source === 'new') {
      return { fileName: FileName, icon: Icon };
    }
    if (CurrentFileId === ref_id) {
      return { fileName: FileName, icon: Icon };
    }
    return { fileName: InitialFileDetails.FileName, icon: InitialFileDetails.Icon };
  }

  const RenderedFileDetails = FileDetailsToRender();
  const { fileName, icon } = RenderedFileDetails;

  function UpdateBlocks(payload, type = 'default') {
    const {
      index, value, IsNewBlock, style,
    } = payload;

    if (IsNewBlock === false) {
      const newArray = [...blocks];
      if (type === 'checkbox') {
        newArray[index].isChecked = payload.isChecked;
      } else if (type === 'color') {
        newArray[index].color = payload.ColorValue;
      } else if (type === 'bgcolor') {
        newArray[index].bgcolor = payload.ColorValue;
      } else {
        newArray[index].value = value;
      }
      setblocks(newArray);
    } else {
      const newArray = [...blocks];
      if (payload.IsDuplicate) {
        newArray.splice(index + 1, 0, { _id: uuidv4(), value, style });
      } else {
        console.log(payload);
        // this value is a non-breaking space character
        newArray.splice(index + 1, 0, {
          _id: uuidv4(), value: '\u00A0', style, color: '#37352F', bgcolor: '#FFFFFF',
        });
      }
      setblocks(newArray);
    }
  }

  function UpdateBlockStyle(payload) {
    const newArray = [...blocks];
    newArray[payload.index] = payload.BlockData;
    setblocks(newArray);
  }

  function DeleteBlock(payload) {
    const newArray = [...blocks];
    // payload is the index here
    newArray.splice(payload, 1);
    setblocks(newArray);
  }

  return (
    <div id={styles.main}>
      <div id={styles.top}>
        <EditorTop FileDetails={{
          CoverPhoto, Icon, ref_id, icon,
        }}
        />
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
              ? blocks.map((elem, index) => {
                // let NumberedListCount = 0;
                if (((index !== 0) && (blocks[index - 1].style !== 'number_list' || elem.style !== 'number_list')) || index === 0) {
                  NumberedListCount.current = 1;
                } else if (elem.style === 'number_list' && index !== 0) {
                  NumberedListCount.current += 1;
                }
                return (
                  <Blocks
                    key={elem._id}
                    BlockData={{ elem, index }}
                    UpdateBlocks={UpdateBlocks}
                    DeleteBlock={DeleteBlock}
                    UpdateBlockStyle={UpdateBlockStyle}
                    NumberedListCount={NumberedListCount.current}
                  />
                );
                return null;
              })
              : (
                <div
                  id={styles.add_first_block}
                  onClick={() => {
                    setblocks([{
                      _id: uuidv4(),
                      value: '\u00A0',
                      style: 'text',
                      color: '#37352F',
                      bgcolor: '#FFFFFF',
                    },
                    {
                      _id: uuidv4(),
                      value: '\u00A0',
                      style: 'text',
                      color: '#37352F',
                      bgcolor: '#FFFFFF',
                    },
                    {
                      _id: uuidv4(),
                      value: '\u00A0',
                      style: 'text',
                      color: '#37352F',
                      bgcolor: '#FFFFFF',
                    },
                    {
                      _id: uuidv4(),
                      value: '\u00A0',
                      style: 'text',
                      color: '#37352F',
                      bgcolor: '#FFFFFF',
                    },
                    {
                      _id: uuidv4(),
                      value: '\u00A0',
                      style: 'text',
                      color: '#37352F',
                      bgcolor: '#FFFFFF',
                    }]);
                  }}
                >
                  <div id={styles.icon}><DescriptionIcon /></div>
                  <div id={styles.text}>Add New Block</div>
                </div>
              )

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
