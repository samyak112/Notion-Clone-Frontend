import React from 'react';
import styles from './BlockOptions.module.css';
import BlockOptionsData from '../Blocks/BlockOptionsData';

function ColorOptions({
  Heading, MappedData, ChangeBlockColor, text,
}) {
  const { BlockColors, BlockBackground } = BlockOptionsData;

  const Identifier = Heading.toLowerCase();

  return (
    <>
      <div className={styles.option_heading}>
        {Heading}
      </div>
      {MappedData.map((item, key) => (
        <div
          key={item.id}
          className={styles.basic_block}
          onClick={() => { ChangeBlockColor(item[Identifier], Identifier); }}
        >
          <div className={styles.block_icon} style={{ [Identifier]: item[Identifier] }}>
            {' '}
            A
          </div>
          <div className={styles.block_text}>
            <div className={styles.text}>{item.Heading}</div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ColorOptions;
