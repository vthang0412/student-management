/**
 * StudentTable Component
 * Hiển thị danh sách sinh viên dạng bảng với các nút hành động
 * Props:
 *   - students: Student[]
 *   - isLoading: boolean
 *   - error: string | null
 *   - onView: (student) => void
 *   - onEdit: (student) => void
 *   - onDelete: (student) => void
 */

// ⚠️ CÁC TRƯỜNG (id, studentCode, fullName ...) là GIẢ ĐỊNH dựa trên đặc tả.
//    Điều chỉnh theo JSON thực tế từ Backend trước khi sử dụng.

const GENDER_LABEL = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' };

const StudentTable = ({ students, isLoading, error, onView, onEdit, onDelete }) => {
  // ----- Loading state -----
  if (isLoading) {
    return (
      <div className="card">
        <div className="state-box">
          <div className="spinner" />
          <p>Đang tải dữ liệu sinh viên...</p>
        </div>
      </div>
    );
  }

  // ----- Error state -----
  if (error) {
    return (
      <div className="card">
        <div className="state-box">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong>Không thể tải dữ liệu</strong>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ----- Empty state -----
  if (!students || students.length === 0) {
    return (
      <div className="card">
        <div className="state-box">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <div>
            <strong>Không có sinh viên nào</strong>
            <p>Nhấn "Thêm sinh viên" để bắt đầu.</p>
          </div>
        </div>
      </div>
    );
  }

  // ----- Data table -----
  return (
    <div className="card">
      <div className="table-container">
        <table aria-label="Danh sách sinh viên">
          <thead>
            <tr>
              <th>#</th>
              <th>Mã SV</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th style={{ textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{index + 1}</td>
                <td>
                  <span style={{
                    fontFamily: 'monospace', fontSize: '0.82rem',
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    padding: '2px 8px', borderRadius: 4, fontWeight: 600,
                  }}>
                    {student.studentCode || '—'}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{student.fullName || '—'}</div>
                  {student.address && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>
                      {student.address}
                    </div>
                  )}
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{student.email || '—'}</td>
                <td>{student.phone || '—'}</td>
                <td>
                  {student.gender ? (
                    <span className={`badge ${student.gender === 'FEMALE' ? 'badge-pink' : 'badge-blue'}`}>
                      {GENDER_LABEL[student.gender] || student.gender}
                    </span>
                  ) : '—'}
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {student.dateOfBirth ? formatDate(student.dateOfBirth) : '—'}
                </td>
                <td>
                  <div className="action-group" style={{ justifyContent: 'center' }}>
                    {/* Xem chi tiết */}
                    <button
                      className="btn-icon view"
                      title="Xem chi tiết"
                      onClick={() => onView(student)}
                      id={`btn-view-${student.id}`}
                      aria-label={`Xem chi tiết ${student.fullName}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    {/* Chỉnh sửa */}
                    <button
                      className="btn-icon"
                      title="Chỉnh sửa"
                      onClick={() => onEdit(student)}
                      id={`btn-edit-${student.id}`}
                      aria-label={`Chỉnh sửa ${student.fullName}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    {/* Xóa */}
                    <button
                      className="btn-icon danger"
                      title="Xóa"
                      onClick={() => onDelete(student)}
                      id={`btn-delete-${student.id}`}
                      aria-label={`Xóa ${student.fullName}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper: format date string (ISO) -> dd/MM/yyyy
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  } catch {
    return dateStr;
  }
}

export default StudentTable;
