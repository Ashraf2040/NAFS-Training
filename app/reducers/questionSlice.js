import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   questionImageUrl: "",
//   quizAssets: [],
// };
const initialState = {
  
  quizAssets: [

    // {questionImageUrl: "",
    //   questionImageMetadata :""}
    
    ]
    
  
}




export const questionSlice = createSlice({
  name: "question",
  initialState,

  reducers: {
    setQuizAssets: (state, action) => {
      state.quizAssets =[...state.quizAssets,action.payload]
    },
    restQuizAssets: (state) => {
      state.quizAssets = [];
    }
    // setQuizAssets: (state, action) => {
    //   state.quizAssets = [...quizAssets,action.payload];
    // },
  },
});

export const { restQuizAssets, setQuizAssets } = questionSlice.actions;
export default questionSlice.reducer;
