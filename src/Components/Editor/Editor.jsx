/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Alert from '@mui/material/Alert';
import styles from './Editor.module.css';
import {
  InitialFileName, ChangeCurrentFileId, CurrentFileName, UpdateTree,
} from '../../Redux/ExplorerSlice';
import EditorTop from '../EditorTop/EditorTop';
import Blocks from '../Blocks/Blocks';

function Editor({ IndividualFileData, source, Root = null }) {
  // redux
  const CurrentFileDetails = useSelector((state) => state.ExplorerDetails.CurrentValue);
  const InitialFileDetails = useSelector((state) => state.ExplorerDetails.InitialValues);
  const CurrentFileId = useSelector((state) => state.ExplorerDetails.current_id);

  // state
  const [blocks, setblocks] = useState([]);
  const [ShowAlert, setShowAlert] = useState(false);

  // ref
  const NumberedListCount = useRef(0);

  // destructured props
  const { FileName, Icon } = CurrentFileDetails;
  const { CoverPhoto, values, ref_id } = IndividualFileData;
  const dispatch = useDispatch();

  const url = import.meta.env.VITE_URL;
  useEffect(() => {
    setblocks(values);
  }, [values]);

  function FileDetailsToRender() {
    if (source === 'new' || CurrentFileId === ref_id) {
      return { RenderedFileName: FileName, RenderedIcon: Icon };
    }
    // if (CurrentFileId === ref_id) {
    //   return { fileName: FileName, icon: Icon };
    // }
    return { RenderedFileName: InitialFileDetails.FileName, RenderedIcon: InitialFileDetails.Icon };
  }

  const RenderedFileDetails = FileDetailsToRender();
  const { RenderedFileName, RenderedIcon } = RenderedFileDetails;

  function UpdateBlocks(payload, type = 'default') {
    const {
      index, value, IsNewBlock, style,
    } = payload;

    if (IsNewBlock === false) {
      const newArray = [...blocks];
      if (type === 'checkbox') {
        newArray[index].isChecked = payload.isChecked;
      } else if (type === 'color' || type === 'background') {
        newArray[index][type] = payload.ColorValue;
      } else {
        newArray[index].value = value;
      }
      setblocks(newArray);
    } else {
      const newArray = [...blocks];
      if (payload.IsDuplicate) {
        newArray.splice(index + 1, 0, { _id: uuidv4(), value, style });
      } else {
        newArray.splice(index + 1, 0, {
          _id: uuidv4(), color: '#37352F', background: '#FFFFFF', value: '', style,
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

  function ChangeBlockPosition(payload) {
    const {
      NewIndex, CurrentIndex, data, direction,
    } = payload;
    const NewArray = [...blocks];
    NewArray.splice(CurrentIndex, 1);
    if (direction === 'up') {
      NewArray.splice(NewIndex, 0, data);
    } else {
      NewArray.splice(NewIndex - 1, 0, data);
    }
    setblocks(NewArray);
  }

  async function SaveFileData(payload) {
    let FinalPayload = {
      ...payload, BlockValues: blocks, FileName: null, Icon: null,
    };

    if (InitialFileDetails.FileName !== CurrentFileDetails.FileName) {
      FinalPayload = {
        ...FinalPayload,
        FileName: CurrentFileDetails.FileName,
        Icon: CurrentFileDetails.Icon,
      };
    }

    if (source === 'old') {
      const res = await fetch(`${url}/FileData`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          FinalPayload, ref_id,
        }),
      });
      const response = await res.json();
      // if (response.status === 200) {
      //   dispatch(ReloadData(true));
      // }
    } else {
      const { BlockValues, FileName } = FinalPayload;
      if (FileName === '' || BlockValues.length === 0) {
        setShowAlert(true);
      } else {
        const res = await fetch(`${url}/FileData`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token'),
          },
          body: JSON.stringify({
            FinalPayload, id: IndividualFileData.id,
          }),
        });
        const response = await res.json();
        if (response.status === 200) {
          dispatch(UpdateTree({
            Root,
            Icon: CurrentFileDetails.Icon,
            FileName: CurrentFileDetails.FileName,
            NewFileId: response.id,
          }));
        }
      }
    }
  }

  return (
    <div id={styles.main}>
      <div id={styles.error_message} style={ShowAlert ? { display: 'block' } : { display: 'none' }}>
        <Alert severity="error" onClose={() => { setShowAlert(false); }}>Add File Name and minimum one Block</Alert>
      </div>
      <div id={styles.top}>
        <EditorTop
          FileDetails={{
            CoverPhoto, Icon, ref_id, RenderedIcon,
          }}
          SaveFileData={SaveFileData}
        />
      </div>

      <div id={styles.main_content_wrap}>
        <div id={styles.main_content}>
          <div className={styles.editor_comps} id={styles.title}>
            <input
              className={styles.input_field}
              value={RenderedFileName}
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
                    ChangeBlockPosition={ChangeBlockPosition}
                    NumberedListCount={NumberedListCount.current}
                  />
                );
              })
              : (
                <div
                  id={styles.add_first_block}
                  onClick={() => {
                    setblocks([{
                      _id: uuidv4(),
                      value: '',
                      style: 'text',
                      color: '#37352F',
                      background: '#FFFFFF',
                    },
                    ]);
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
    values: [{ value: '', style: 'text' }],
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
