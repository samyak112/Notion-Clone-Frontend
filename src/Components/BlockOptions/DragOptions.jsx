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
import BasicOptions from './BasicOptions';

function DragOptions({
  DeleteBlock, AddNewBlock, index, ChangeBlockColor, ChangeBlockStyle,
}) {
  const [DragOptionState, setDragOptionState] = useState({ TurnInto: false, Color: false });

  const { BlockColors, BlockBackground } = BlockOptionsData;

  function HandleDragOptions(e) {
    const DivName = e.target.innerText;
    const { TurnInto, Color } = DragOptionState;

    if (e.target.nodeName === 'DIV') {
      if (DivName === 'Color') {
        setDragOptionState({ TurnInto: false, Color: true });
      } else if (DivName === 'Turn into') {
        setDragOptionState({ TurnInto: true, Color: false });
      } else if ((DivName === 'Delete' || DivName === 'Duplicate') && (TurnInto === true || Color === true)) {
        setDragOptionState({ TurnInto: false, Color: false });
      }
    }
  }

  function ChangeBlockColor2(ColorValue, type) {
    ChangeBlockColor(ColorValue, type);
    setDragOptionState({ TurnInto: false, Color: false });
  }

  function ChangeBlockStyle2(BlockValue) {
    ChangeBlockStyle(BlockValue);
    setDragOptionState({ TurnInto: false, Color: false });
  }

  return (
    <div
      onMouseOver={(e) => { HandleDragOptions(e); }}
    >

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
      >
        <div className={styles.drag_options_left}>
          <div className={styles.drag_option_icon}><ImportExportOutlinedIcon /></div>
          <div className={styles.drag_option_text}>Turn into</div>
        </div>
        <div className={styles.drag_options_right}>
          <ArrowForwardIosIcon fontSize="small" />
          <div
            className={styles.open_drag_options}
            style={DragOptionState.TurnInto ? { display: 'block' } : { display: 'none' }}
          >
            <BasicOptions ChangeBlockStyle={ChangeBlockStyle2} />
          </div>
        </div>

      </div>
      <div
        className={styles.drag_options_comps}
      >
        <div className={styles.drag_options_left}>
          <div className={styles.drag_option_icon}><FormatPaintOutlinedIcon /></div>
          <div className={styles.drag_option_text}>Color</div>
        </div>
        <div className={styles.drag_options_right}>
          <ArrowForwardIosIcon fontSize="small" />
          <div
            className={styles.open_drag_options}
            style={DragOptionState.Color ? { display: 'block' } : { display: 'none' }}
          >
            <ColorOptions Heading="Color" MappedData={BlockColors} ChangeBlockColor={ChangeBlockColor2} />
            <ColorOptions Heading="Background" MappedData={BlockBackground} ChangeBlockColor={ChangeBlockColor2} />
          </div>
        </div>

      </div>

    </div>
  );
}

export default DragOptions;
