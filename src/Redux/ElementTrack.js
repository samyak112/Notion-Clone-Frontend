/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const ElementTrack = createSlice({
  name: 'TrackingDetails',
  initialState: {
    DraggingDetails: {
      Started: null, source: null, destination: null, current: null, direction: null,
    },
  },
  reducers: {
    ChangeTrackingDetails: (state, action) => {
      const { key, value } = action.payload;
      state.DraggingDetails[key] = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { ChangeTrackingDetails } = ElementTrack.actions;

export default ElementTrack.reducer;
