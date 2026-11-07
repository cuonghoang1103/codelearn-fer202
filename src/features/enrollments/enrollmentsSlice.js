// src/features/enrollments/enrollmentsSlice.js — các khoá học viên đã đăng ký
//   + tiến độ (completedLessons) và tổng bài của từng khoá
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import enrollApi from '../../api/enrollApi';
import courseApi from '../../api/courseApi';
import { logout } from '../auth/authSlice';
import { todayISO } from '../../utils/format';

export const fetchMyEnrollments = createAsyncThunk('enrollments/fetchMine', async (userId) => {
  const items = await enrollApi.getByUser(userId);
  // tổng số bài của từng khoá (để tính %) — MỘT lần gọi cho mọi khoá
  const lessons = items.length ? await courseApi.getLessonsOfCourses(items.map((e) => e.courseId)) : [];
  const totals = {};
  lessons.forEach((l) => {
    totals[l.courseId] = (totals[l.courseId] ?? 0) + 1;
  });
  return { items, totals };
});

export const enrollCourse = createAsyncThunk(
  'enrollments/enroll',
  async ({ userId, courseId }) => {
    // hỏi lại máy chủ trước khi ghi: không tạo bản ghi trùng (hai tab, hay state cũ)
    const existing = await enrollApi.find(userId, courseId);
    if (existing.length > 0) return existing[0];
    return enrollApi.create({ userId, courseId, enrolledAt: todayISO(), completedLessons: [] });
  },
  // đang gửi ⇒ bỏ qua cú bấm thứ hai (double click) — thunk không chạy, không có POST thứ hai
  { condition: (_, { getState }) => getState().enrollments.enrollStatus !== 'loading' },
);

// Đánh dấu / bỏ đánh dấu một bài: tạo MẢNG MỚI (không push vào mảng của state), bỏ trùng, sắp tăng dần
export const toggleLessonComplete = createAsyncThunk('enrollments/toggleLesson', async ({ enrollment, lessonId }) => {
  const done = new Set(enrollment.completedLessons);
  if (done.has(lessonId)) done.delete(lessonId);
  else done.add(lessonId);
  return enrollApi.updateProgress(enrollment.id, [...done].sort((a, b) => a - b));
});

const initialState = {
  items: [],
  totals: {},          // { courseId: số bài }
  status: 'idle',
  error: null,
  enrollStatus: 'idle',
  savingLesson: false,
};

const enrollmentsSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totals = action.payload.totals;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(enrollCourse.pending, (state) => {
        state.enrollStatus = 'loading';
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.enrollStatus = 'succeeded';
        if (!state.items.some((e) => e.id === action.payload.id)) state.items.unshift(action.payload);
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        // condition false cũng sinh action rejected (meta.condition) — không được đè trạng thái của lượt đang chạy
        if (!action.meta.condition) state.enrollStatus = 'failed';
      })
      .addCase(toggleLessonComplete.pending, (state) => {
        state.savingLesson = true;
      })
      .addCase(toggleLessonComplete.fulfilled, (state, action) => {
        state.savingLesson = false;
        const e = state.items.find((x) => x.id === action.payload.id);
        if (e) e.completedLessons = action.payload.completedLessons;   // giữ e.course đã _expand
      })
      .addCase(toggleLessonComplete.rejected, (state) => {
        state.savingLesson = false;
      })
      // đăng xuất ⇒ quên dữ liệu của người cũ (đăng nhập tài khoản khác không thấy khoá của người trước)
      .addCase(logout, () => initialState);
  },
});

export const selectEnrollmentByCourse = (state, courseId) => state.enrollments.items.find((e) => e.courseId === courseId);

export default enrollmentsSlice.reducer;
