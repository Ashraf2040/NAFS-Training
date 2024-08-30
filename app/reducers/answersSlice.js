import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    quiz: {},
    answers: "",
};


export const answersSlice = createSlice({
  name: "answers",

  initialState,

  reducers: {
    setAnswers: (state, action) => {
      state.answers =  (action.payload);
    },

    setQuiz: (state, action) => {
      state.quiz = action.payload;
    },

    clearAnswers: (state) => {
      state.answers = [];
    },

    clearQuiz: (state) => {
      state.quiz = {};
    },  

  },
});

export const { setAnswers, setQuiz, clearAnswers, clearQuiz } =
  answersSlice.actions;
export default answersSlice.reducer;