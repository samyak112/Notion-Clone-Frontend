/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const ExplorerDetailsSlice = createSlice({
  name: 'ExplorerDetails',
  initialState: {
    value: 250,
    tracker: false,
  },
  reducers: {
    ExplorerWidthValue: (state, action) => {
      state.value = action.payload;
    },
    StartTracking: (state, action) => {
      state.tracker = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { ExplorerWidthValue, StartTracking } = ExplorerDetailsSlice.actions;

export default ExplorerDetailsSlice.reducer;
