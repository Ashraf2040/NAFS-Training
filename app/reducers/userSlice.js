
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,   

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserScore: (state, action) => {
      state.user.score =Number(state.user?.score) +  +action.payload;
    },
    clearUser: (state) => {
      state.user = null;   

    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setUser, clearUser, updateUser ,setUserScore} = userSlice.actions;

export default userSlice.reducer;