/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from './BlockOptions.module.css';
import ColorOptions from './ColorOptions';
import BlockOptionsData from '../Blocks/BlockOptionsData';

function DragOptions({
  DeleteBlock, AddNewBlock, index, Heading, ChangeBlockColor, text,
}) {
  const [DragOptionState, setDragOptionState] = useState({ TurnInto: false, Color: false });

  const { BlockColors, BlockBackground } = BlockOptionsData;

  function HandleDragOptions(option) {
    const { TurnInto, Color } = DragOptionState;
    if (option === 'Color') {
      if (Color === false) {
        setDragOptionState({ ...DragOptionState, Color: true });
      }
    } else if (TurnInto === false) {
      setDragOptionState({ ...DragOptionState, TurnInto: true });
    }
  }
  return (
    <>
      <div className={styles.drag_options_comps} onClick={() => { DeleteBlock(index); }}>
        <div className={styles.drag_option_icon}><DeleteOutlineOutlinedIcon /></div>
        <div className={styles.drag_option_text}>Delete</div>
      </div>
      <div className={styles.drag_options_comps} onClick={(e) => { AddNewBlock('Duplicate', e); }}>
        <div className={styles.drag_option_icon}><ContentCopyOutlinedIcon /></div>
        <div className={styles.drag_option_text}>Duplicate</div>
      </div>
      <div
        className={styles.drag_options_comps}
        onMouseOver={() => { HandleDragOptions('TurnInto'); }}
      >
        <div className={styles.drag_options_left}>
          <div className={styles.drag_option_icon}><ImportExportOutlinedIcon /></div>
          <div className={styles.drag_option_text}>Turn into</div>
        </div>
        <div className={styles.drag_options_right}>
          <ArrowForwardIosIcon fontSize="small" />
          {/* <div
            className={styles.open_drag_options}
            style={DragOptionState.TurnInto ? { display: 'flex' } : { display: 'none' }}
          >
            hii
          </div> */}
        </div>

      </div>
      <div
        className={styles.drag_options_comps}
        onMouseOver={() => { HandleDragOptions('Color'); }}
      >
        <div className={styles.drag_options_left}>
          <div className={styles.drag_option_icon}><FormatPaintOutlinedIcon /></div>
          <div className={styles.drag_option_text}>Color</div>
        </div>
        <div className={styles.drag_options_right}>
          <ArrowForwardIosIcon fontSize="small" />
          <div
            className={styles.open_drag_options}
            style={DragOptionState.Color ? { dissplay: 'flex' } : { display: 'none' }}
          >
            <ColorOptions Heading="Color" MappedData={BlockColors} ChangeBlockColor={ChangeBlockColor} />
          <ColorOptions Heading="Background" MappedData={BlockBackground} ChangeBlockColor={ChangeBlockColor} />
          {/* hihiiiiiasdasdaasdsadasdsdssadsdadd */}
          </div>
        </div>

      </div>

    </>
  );
}

export default DragOptions;
