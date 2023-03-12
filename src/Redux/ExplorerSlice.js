/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const ExplorerDetailsSlice = createSlice({
  name: 'ExplorerDetails',
  initialState: {
    value: 250,
    tracker: false,
    current_id: null,
    current_name: null,
  },
  reducers: {
    ExplorerWidthValue: (state, action) => {
      state.value = action.payload;
    },
    StartTracking: (state, action) => {
      state.tracker = action.payload;
    },
    CurrentFileId: (state, action) => {
      state.current_id = action.payload;
    },
    CurrentFileName: (state, action) => {
      state.current_name = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  ExplorerWidthValue, StartTracking, CurrentFileId, CurrentFileName,
} = ExplorerDetailsSlice.actions;

export default ExplorerDetailsSlice.reducer;
