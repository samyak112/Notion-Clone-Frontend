import { configureStore } from '@reduxjs/toolkit';
import explorer from './ExplorerSlice';

export default configureStore({
  reducer: {
    ExplorerDetails: explorer,
  },
});
