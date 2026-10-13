import axios from 'axios';

// ============================================================
// CẤU HÌNH BASE URL TỪ BIẾN MÔI TRƯỜNG
// Đặt VITE_API_BASE_URL trong file .env
// Local:  VITE_API_BASE_URL=http://localhost:8080
// VPS:    VITE_API_BASE_URL=http://your-vps-ip:8080
// ============================================================
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 giây timeout
});

// ============================================================
// INTERCEPTOR: Xử lý lỗi toàn cục
// ============================================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Kết nối tới server bị timeout. Vui lòng thử lại.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Không thể kết nối tới server. Hãy kiểm tra backend đang chạy.'));
    }
    const status = error.response.status;
    const serverMessage = error.response.data?.message || error.response.data;
    if (status === 404) {
      return Promise.reject(new Error(serverMessage || 'Không tìm thấy tài nguyên (404).'));
    }
    if (status === 400) {
      return Promise.reject(new Error(serverMessage || 'Dữ liệu không hợp lệ (400).'));
    }
    if (status === 500) {
      return Promise.reject(new Error(serverMessage || 'Lỗi server nội bộ (500).'));
    }
    return Promise.reject(new Error(serverMessage || `Lỗi HTTP ${status}`));
  }
);

// ============================================================
// STUDENT API
// ⚠️  GIẢI ĐỊNH: Các endpoint sau dựa trên chuẩn REST thông thường.
//     Vui lòng đối chiếu với Backend Developer trước khi sử dụng.
//     Các trường DTO: { id, studentCode, fullName, email, phone,
//                       dateOfBirth, gender, address }
//     Điều chỉnh nếu Backend trả về cấu trúc JSON khác.
// ============================================================

/**
 * Lấy danh sách tất cả sinh viên
 * GET /api/students
 */
export const getAllStudents = () => apiClient.get('/api/students');

/**
 * Lấy chi tiết một sinh viên theo ID
 * GET /api/students/{id}
 */
export const getStudentById = (id) => apiClient.get(`/api/students/${id}`);

/**
 * Tìm kiếm sinh viên theo từ khoá (mã SV hoặc họ tên)
 * GET /api/students/search?keyword=...
 * ⚠️ Endpoint search có thể khác tùy backend. Đối chiếu với Backend Developer.
 */
export const searchStudents = (keyword) =>
  apiClient.get('/api/students/search', { params: { keyword } });

/**
 * Thêm sinh viên mới
 * POST /api/students
 */
export const createStudent = (studentData) => apiClient.post('/api/students', studentData);

/**
 * Cập nhật thông tin sinh viên
 * PUT /api/students/{id}
 */
export const updateStudent = (id, studentData) =>
  apiClient.put(`/api/students/${id}`, studentData);

/**
 * Xóa sinh viên
 * DELETE /api/students/{id}
 */
export const deleteStudent = (id) => apiClient.delete(`/api/students/${id}`);
