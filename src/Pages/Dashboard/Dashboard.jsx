/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import Explorer from '../../Components/Explorer/Explorer';
import styles from './dashboard.module.css';
import FileEditArea from '../../Components/FileEditArea/FileEditArea';

function Register() {
  return (
    <div id={styles.main}>
      <div id={styles.explorer}><Explorer /></div>
      <div id={styles.editor}><FileEditArea /></div>
    </div>
  );
}

export default Register;
