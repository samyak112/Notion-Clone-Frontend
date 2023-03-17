/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const ExplorerDetailsSlice = createSlice({
  name: 'ExplorerDetails',
  initialState: {
    value: 250,
    tracker: false,
    current_id: null,
    LastUpdatedValue: { FileName: null, Icon: null },
    CurrentValue: { FileName: null, Icon: null },
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
      state.CurrentValue = action.payload;
    },
    LastUpdatedFileName: (state, action) => {
      state.LastUpdatedValue = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  ExplorerWidthValue, StartTracking, CurrentFileId, CurrentFileName, LastUpdatedFileName,
} = ExplorerDetailsSlice.actions;

export default ExplorerDetailsSlice.reducer;
