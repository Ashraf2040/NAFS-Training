import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  quizzes: [], // Array to store quiz results
};

export const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserScore: (state, action) => {
      state.user.score = Number(state.user?.score) + Number(action.payload);
    },
    clearUser: (state) => {
      state.user = null;
      state.quizzes = []; // Reset quizzes when clearing the user
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    addQuizResult: (state, action) => {
      // Add a new quiz result to the quizzes array
      const { quizId, score, userAnswers } = action.payload;
      const existingQuizIndex = state.quizzes.findIndex((quiz) => quiz.quizId === quizId);

      if (existingQuizIndex !== -1) {
        // Update the existing quiz result
        state.quizzes[existingQuizIndex] = { quizId, score, userAnswers };
      } else {
        // Add a new quiz result
        state.quizzes.push({ quizId, score, userAnswers });
      }
    },
  },
});

export const { setUser, setUserScore, clearUser, updateUser, addQuizResult } = userSlice.actions;

export default userSlice.reducer;