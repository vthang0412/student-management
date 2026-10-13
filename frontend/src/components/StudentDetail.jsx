/**
 * StudentDetail Component
 * Modal xem chi tiết thông tin sinh viên (read-only)
 * Props:
 *   - isOpen: boolean
 *   - student: Student | null
 *   - onClose: () => void
 *   - onEdit: (student) => void
 */

const GENDER_LABEL = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' };

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try { return new Date(dateStr).toLocaleDateString('vi-VN'); }
  catch { return dateStr; }
}

const StudentDetail = ({ isOpen, student, onClose, onEdit }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="detail-modal-title">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h3 id="detail-modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2.5"
              style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Chi tiết sinh viên
          </h3>
          <button className="modal-close" onClick={onClose} aria-label="Đóng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Avatar + Name Banner */}
        <div style={{
          padding: '20px 24px 16px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {(student.fullName || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              {student.fullName || '—'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              Mã SV: <strong>{student.studentCode || '—'}</strong>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <label>Email</label>
              <span>{student.email || '—'}</span>
            </div>
            <div className="detail-item">
              <label>Số điện thoại</label>
              <span>{student.phone || '—'}</span>
            </div>
            <div className="detail-item">
              <label>Ngày sinh</label>
              <span>{formatDate(student.dateOfBirth)}</span>
            </div>
            <div className="detail-item">
              <label>Giới tính</label>
              <span>
                {student.gender ? (
                  <span className={`badge ${student.gender === 'FEMALE' ? 'badge-pink' : 'badge-blue'}`}>
                    {GENDER_LABEL[student.gender] || student.gender}
                  </span>
                ) : '—'}
              </span>
            </div>
            <div className="detail-item full-width">
              <label>Địa chỉ</label>
              <span>{student.address || '—'}</span>
            </div>
            <div className="detail-item">
              <label>ID hệ thống</label>
              <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {student.id}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
          <button className="btn btn-primary" onClick={() => { onClose(); onEdit(student); }} id="detail-edit-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
