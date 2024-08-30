
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice'; 
import questionReducer from './reducers/questionSlice';
import answersReducer from './reducers/answersSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    question: questionReducer,
    answer: answersReducer
  },
});