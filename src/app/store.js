// src/app/store.js — store Redux duy nhất của app: mỗi "feature" một slice
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { STORAGE_KEY } from '../features/auth/authSlice';
import coursesReducer from '../features/courses/coursesSlice';
import enrollmentsReducer from '../features/enrollments/enrollmentsSlice';
import quizReducer from '../features/quiz/quizSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    enrollments: enrollmentsReducer,
    quiz: quizReducer,
  },
});

// Lưu phiên đăng nhập NGOÀI reducer (reducer phải thuần — không đụng localStorage).
// Chỉ ghi khi user thật sự đổi (đăng nhập / đăng ký / đăng xuất), không ghi lại ở mọi action.
let lastUser = store.getState().auth.user;
store.subscribe(() => {
  const { user } = store.getState().auth;
  if (user === lastUser) return;
  lastUser = user;
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
});

export default store;
