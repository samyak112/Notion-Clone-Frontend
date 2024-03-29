import React from 'react';
import styles from './BlockOptions.module.css';
import BlockOptionsData from '../Blocks/BlockOptionsData';

function BasicOptions({ ChangeBlockStyle }) {
  const { BasicBlocks } = BlockOptionsData;
  return (
    <>
      <div className={styles.option_heading}>
        Basic Block
      </div>
      {
          BasicBlocks.map((item, key) => (
            <div
              key={item.id}
              className={styles.basic_block}
              onClick={() => {
                ChangeBlockStyle(item.value);
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
    </>
  );
}

export default BasicOptions;
