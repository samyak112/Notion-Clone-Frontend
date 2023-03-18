import { configureStore } from '@reduxjs/toolkit';
import explorer from './ExplorerSlice';
import DraggingDetails from './ElementTrack';

export default configureStore({
  reducer: {
    ExplorerDetails: explorer,
    TrackingDetails: DraggingDetails,
  },
});
