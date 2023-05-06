/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const ExplorerDetailsSlice = createSlice({
  name: 'ExplorerDetails',
  initialState: {
    value: 250,
    tracker: false,
    current_id: null,
    InitialValues: { FileName: null, Icon: null },
    CurrentValue: { FileName: null, Icon: null },
    UpdateTreevalue: null,
    CurrentFilePath: null,
  },
  reducers: {
    ExplorerWidthValue: (state, action) => {
      state.value = action.payload;
    },
    StartTracking: (state, action) => {
      state.tracker = action.payload;
    },
    ChangeCurrentFileId: (state, action) => {
      state.current_id = action.payload;
    },
    CurrentFileName: (state, action) => {
      state.CurrentValue = action.payload;
    },
    InitialFileName: (state, action) => {
      state.InitialValues = action.payload;
    },
    UpdateTree: (state, action) => {
      state.UpdateTreevalue = action.payload;
    },
    UpdateCurrentFilePath: (state, action) => {
      state.CurrentFilePath = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  ExplorerWidthValue, StartTracking,
  ChangeCurrentFileId, CurrentFileName, InitialFileName, UpdateTree, UpdateCurrentFilePath,
} = ExplorerDetailsSlice.actions;

export default ExplorerDetailsSlice.reducer;
