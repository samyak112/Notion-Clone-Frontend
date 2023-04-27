import React from 'react';
import Explorer from '../../Components/Explorer/Explorer';
import styles from './dashboard.module.css';
import FileEditArea from '../../Components/FileEditArea/FileEditArea';

function Dashboard() {
  return (
    <div id={styles.main}>
      <div id={styles.explorer}><Explorer /></div>
      <div id={styles.editor}><FileEditArea /></div>
    </div>
  );
}

export default Dashboard;
