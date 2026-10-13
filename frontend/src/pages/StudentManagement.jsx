import { useState, useCallback, useEffect, useRef } from 'react';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';
import StudentDetail from '../components/StudentDetail';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchBar from '../components/SearchBar';
import {
  getAllStudents,
  searchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../api/studentApi';

/**
 * StudentManagement Page
 * Trang chính quản lý sinh viên - tích hợp tất cả chức năng CRUD
 */
const StudentManagement = ({ addToast }) => {
  // ---- State ----
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modals
  const [formModal, setFormModal] = useState({ open: false, mode: 'add', data: null });
  const [detailModal, setDetailModal] = useState({ open: false, student: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, student: null, loading: false });
  const [formLoading, setFormLoading] = useState(false);

  const searchDebounceRef = useRef(null);

  // ---- Load all students ----
  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAllStudents();
      // ⚠️ GIẢ ĐỊNH: Backend trả về mảng trực tiếp hoặc { data: [...] }
      // Điều chỉnh theo cấu trúc JSON thực tế từ Backend
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.content || []);
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // ---- Search với debounce 400ms ----
  const handleSearchChange = (val) => {
    setSearchKeyword(val);
    clearTimeout(searchDebounceRef.current);
    if (!val.trim()) {
      loadStudents();
      return;
    }
    searchDebounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await searchStudents(val.trim());
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.content || []);
        setStudents(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  };

  // ---- Add Student ----
  const handleAddSubmit = async (formData) => {
    setFormLoading(true);
    try {
      await createStudent(formData);
      addToast('Thêm sinh viên thành công!', 'success');
      setFormModal({ open: false, mode: 'add', data: null });
      loadStudents();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ---- Edit Student ----
  const handleEditSubmit = async (formData) => {
    setFormLoading(true);
    try {
      await updateStudent(formModal.data.id, formData);
      addToast('Cập nhật sinh viên thành công!', 'success');
      setFormModal({ open: false, mode: 'add', data: null });
      loadStudents();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ---- Delete Student ----
  const handleDeleteConfirm = async () => {
    if (!deleteDialog.student) return;
    setDeleteDialog((prev) => ({ ...prev, loading: true }));
    try {
      await deleteStudent(deleteDialog.student.id);
      addToast(`Đã xóa sinh viên "${deleteDialog.student.fullName}".`, 'success');
      setDeleteDialog({ open: false, student: null, loading: false });
      loadStudents();
    } catch (err) {
      addToast(err.message, 'error');
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  // ---- Stats ----
  const totalStudents = students.length;
  const maleCount = students.filter((s) => s.gender === 'MALE').length;
  const femaleCount = students.filter((s) => s.gender === 'FEMALE').length;

  return (
    <>
      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon indigo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div className="stat-label">Tổng sinh viên</div>
            <div className="stat-value">{totalStudents}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="stat-label">Nam</div>
            <div className="stat-value">{maleCount}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="stat-label">Nữ</div>
            <div className="stat-value">{femaleCount}</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <SearchBar
          value={searchKeyword}
          onChange={handleSearchChange}
          onSearch={() => handleSearchChange(searchKeyword)}
          isLoading={searchLoading}
        />
        <button
          id="btn-add-student"
          className="btn btn-primary"
          onClick={() => setFormModal({ open: true, mode: 'add', data: null })}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Thêm sinh viên
        </button>
        <button className="btn btn-secondary btn-sm" onClick={loadStudents} title="Làm mới dữ liệu" aria-label="Refresh">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Table */}
      <StudentTable
        students={students}
        isLoading={isLoading}
        error={error}
        onView={(s) => setDetailModal({ open: true, student: s })}
        onEdit={(s) => setFormModal({ open: true, mode: 'edit', data: s })}
        onDelete={(s) => setDeleteDialog({ open: true, student: s, loading: false })}
      />

      {/* Form Modal (Add / Edit) */}
      <StudentForm
        isOpen={formModal.open}
        mode={formModal.mode}
        initialData={formModal.data}
        onSubmit={formModal.mode === 'add' ? handleAddSubmit : handleEditSubmit}
        onClose={() => setFormModal({ open: false, mode: 'add', data: null })}
        isLoading={formLoading}
      />

      {/* Detail Modal */}
      <StudentDetail
        isOpen={detailModal.open}
        student={detailModal.student}
        onClose={() => setDetailModal({ open: false, student: null })}
        onEdit={(s) => setFormModal({ open: true, mode: 'edit', data: s })}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Xóa sinh viên"
        message={`Bạn có chắc chắn muốn xóa sinh viên "${deleteDialog.student?.fullName}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ open: false, student: null, loading: false })}
        isLoading={deleteDialog.loading}
      />
    </>
  );
};

export default StudentManagement;
