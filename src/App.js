// src/App.js — khai báo MỌI route của CodeLearn ở một chỗ (nhìn là thấy cả sơ đồ trang)
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from './pages/admin/AdminLayout';
import CourseDetailPage from './pages/CourseDetailPage';
import MyCoursesPage from './pages/MyCoursesPage';
import LearnPage from './pages/LearnPage';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import CourseFormPage from './pages/admin/CourseFormPage';
import CurriculumPage from './pages/admin/CurriculumPage';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminStatsPage from './pages/admin/AdminStatsPage';

export default function App() {
  return (
    <Routes>
      {/* Layout chung: navbar + <Outlet /> + footer cho mọi trang */}
      <Route element={<Layout />}>
        {/* ── Khách (guest) xem được ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Phải đăng nhập (học viên) ── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/learn/:courseId" element={<LearnPage />} />
          <Route path="/learn/:courseId/lessons/:lessonId" element={<LearnPage />} />
          <Route path="/quiz/:chapterId" element={<QuizPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Route>

        {/* ── Chỉ ADMIN — route lồng: AdminLayout có sidebar + <Outlet /> ── */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="courses" replace />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="courses/new" element={<CourseFormPage />} />
          <Route path="courses/:id/edit" element={<CourseFormPage />} />
          <Route path="courses/:id/curriculum" element={<CurriculumPage />} />
          <Route path="questions" element={<AdminQuestionsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="stats" element={<AdminStatsPage />} />
        </Route>

        {/* Mọi đường dẫn không khớp ⇒ 404 (luôn để CUỐI) */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
