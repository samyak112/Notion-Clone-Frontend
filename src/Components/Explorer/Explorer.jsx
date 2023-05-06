/* eslint-disable no-else-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import LeftArrow from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import Skeleton from '@mui/material/Skeleton';
import jwt from 'jwt-decode';
import styles from './explorer.module.css';
import {
  ExplorerWidthValue, StartTracking,
} from '../../Redux/ExplorerSlice';
import IndividualFiles from '../IndividualFiles/IndividualFiles';

function Explorer() {
  const token = localStorage.getItem('token');
  const UserCreds = jwt(token);
  const { username, profile_pic } = UserCreds;

  // redux
  const ExplorerWidth = useSelector((state) => state.ExplorerDetails.value);
  const IsTracking = useSelector((state) => state.ExplorerDetails.tracker);
  const CheckUpdateTree = useSelector((state) => state.ExplorerDetails.UpdateTreevalue);

  // states
  const [FileData, setFileData] = useState(false);

  const dispatch = useDispatch();
  const url = import.meta.env.VITE_URL;

  const removeFile = (tree, TargetValue) => {
    const hasItem = tree.find(({ _id }) => _id === TargetValue);
    if (hasItem) {
      return tree.filter(({ _id }) => _id !== TargetValue);
    }
    const response = tree.map((file) => {
      if (file.children) {
        return {
          ...file,
          children: removeFile(file.children, TargetValue),
        };
      }
      return file;
    });
    return response;
  };

  const GetAllFilesData = async () => {
    const res = await fetch(`${url}/FileData`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
    });
    const data = await res.json();
    setFileData(data.tree);
  };

  const AddNewTopNode = async () => {
    const FinalPayload = {
      FileName: 'Untitled', Icon: '📄', CoverPhoto: { value: null, Position: 50 }, BlockValues: [],
    };
    const res = await fetch(`${url}/FileData`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        FinalPayload, id: null,
      }),
    });
    const data = await res.json();
    if (data.status === 200) {
      const newTree = [...FileData, {
        _id: data.id, FileName: 'Untitled', icon: '📄', parent: null,
      }];
      setFileData(newTree);
    }
  };

  function UpdateNode(tree, TargetValue, NewFileId, FileName, icon, type, action, NewItem) {
    const response = tree.children.map((elem) => {
      if (elem._id === TargetValue) {
        return {
          ...elem,
          children: action === 'add' ? [
            ...(elem.children ?? []),
            {
              _id: NewFileId,
              FileName,
              icon,
              Parent: TargetValue,
              children: [],

            }] : elem.children,
          FileName: action === 'update' && type === 'FileName' ? NewItem : elem.FileName,
          icon: action === 'update' && type === 'icon' ? NewItem : elem.icon,
        };
      }
      if (elem.children) {
        const answer = UpdateNode(
          elem,
          TargetValue,
          NewFileId,
          FileName,
          icon,
          type,
          action,
          NewItem,
        );
        return answer;
      }

      return elem;
    });

    return { ...tree, children: response };
  }

  function UpdateTree(tree, Parent, TargetValue) {
    const { action } = CheckUpdateTree;
    const {
      NewFileId = null, FileName = null, icon = null, type = null, NewItem = null,
    } = CheckUpdateTree.data;
    if (TargetValue === Parent) {
      if (action === 'add' || action === 'update') {
        return tree.map((elem) => {
          if (elem._id === Parent) {
            return {
              ...elem,
              children: action === 'add' ? [
                ...(elem.children ?? []),
                {
                  _id: NewFileId,
                  FileName,
                  icon,
                  Parent: null,
                  children: [],

                }] : elem.children,
              FileName: action === 'update' && type === 'FileName' ? NewItem : elem.FileName,
              icon: action === 'update' && type === 'icon' ? NewItem : elem.icon,
            };
          }
          return elem;
        });
      } else {
        return tree.filter((elem) => {
          if (elem._id === Parent) {
            return false;
          } else {
            return true;
          }
        });
      }
    } else {
      return tree.map((elem) => {
        if (elem._id === Parent) {
          if (action === 'add' || action === 'update') {
            const response = UpdateNode(
              elem,
              TargetValue,
              NewFileId,
              FileName,
              icon,
              type,
              action,
              NewItem,
            );
            return { ...elem, children: response.children };
          } else {
            const response = removeFile(elem.children, TargetValue);
            return { ...elem, children: response };
          }
        }
        return elem;
      });
    }
  }

  useEffect(() => {
    if (CheckUpdateTree != null) {
      const {
        Root, Target,
      } = CheckUpdateTree.data;
      const response = UpdateTree(FileData, Root, Target);
      console.log(response);
      setFileData(response);
    }
  }, [CheckUpdateTree]);

  useEffect(() => {
    GetAllFilesData();
  }, []);

  function IntializeTracking() {
    dispatch(StartTracking(true));
  }

  function ReduceExplorer(e) {
    if (IsTracking === true) {
      if (e.movementX < 0) {
        if (ExplorerWidth > 250) {
          dispatch(ExplorerWidthValue(ExplorerWidth - 5));
        }
      }
    }
  }

  return (
    <div
      id={styles.main}
      onMouseUp={() => { dispatch(StartTracking(false)); }}
      style={{ width: `${ExplorerWidth}px` }}
      onMouseMove={ReduceExplorer}
    >
      <div id={styles.explorer}>
        <div id={styles.navbar_wrap}>
          <div id={styles.navbar}>
            <div id={styles.user_details}>
              <div id={styles.profile_image_wrap} className={styles.navbar_comps}><img id={styles.profile_image} src={profile_pic} alt="" /></div>
              <div id={styles.profile_name} className={styles.navbar_comps}>
                {`${username}' Notion`}
              </div>
            </div>
            <div id={styles.explorer_toggle_wrap}>
              <div id={styles.explorer_toggle} className={styles.navbar_comps}><LeftArrow /></div>
            </div>
          </div>
        </div>

        <div id={styles.all_docs}>
          {
            FileData === false
              ? new Array(5).fill().map((index) => (
                <Skeleton key={index} animation="wave" style={{ marginInline: '.5rem', padding: '.2rem' }} />
              ))
              : FileData.length === 0
                ? (
                  <div id={styles.no_data}>
                    No Data Added Yet
                  </div>
                )
                : FileData.map((elem) => (
                  <IndividualFiles
                    key={elem._id}
                    data={elem}
                  />
                ))
            }
        </div>
        <div
          id={styles.add_new_page}
          onClick={() => { AddNewTopNode(); }}
        >
          <AddIcon />
          {' '}
          New page
        </div>
      </div>
      <div
        id={styles.explorer_width_toggle}
        onMouseDown={IntializeTracking}
      />
    </div>
  );
}

export default Explorer;
