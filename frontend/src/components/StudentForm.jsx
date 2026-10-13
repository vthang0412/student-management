import { useState, useEffect } from 'react';

/**
 * StudentForm Component
 * Modal form để thêm mới hoặc chỉnh sửa thông tin sinh viên
 * Props:
 *   - isOpen: boolean
 *   - mode: 'add' | 'edit'
 *   - initialData: Student | null  (dùng khi mode='edit')
 *   - onSubmit: (formData) => Promise<void>
 *   - onClose: () => void
 *   - isLoading: boolean
 *
 * ⚠️ GIẢ ĐỊNH: Các trường dưới đây dựa trên đặc tả.
 *    Điều chỉnh theo DTO thực tế từ Backend trước khi sử dụng.
 */

const EMPTY_FORM = {
  studentCode: '',
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  address: '',
};

const StudentForm = ({ isOpen, mode = 'add', initialData, onSubmit, onClose, isLoading }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Populate form khi edit
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        studentCode: initialData.studentCode || '',
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        dateOfBirth: initialData.dateOfBirth
          ? initialData.dateOfBirth.slice(0, 10) // lấy yyyy-MM-dd
          : '',
        gender: initialData.gender || '',
        address: initialData.address || '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setErrors({});
  }, [mode, initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng chỉnh sửa field
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ---- Validation ----
  const validate = () => {
    const errs = {};
    if (!formData.studentCode.trim()) errs.studentCode = 'Mã sinh viên không được để trống.';
    if (!formData.fullName.trim()) errs.fullName = 'Họ và tên không được để trống.';
    if (!formData.email.trim()) {
      errs.email = 'Email không được để trống.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Email không đúng định dạng.';
    }
    if (formData.phone && !/^[0-9]{9,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      errs.phone = 'Số điện thoại không hợp lệ (9-11 chữ số).';
    }
    if (!formData.gender) errs.gender = 'Vui lòng chọn giới tính.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    await onSubmit(formData);
  };

  const title = mode === 'add' ? 'Thêm sinh viên mới' : 'Chỉnh sửa thông tin sinh viên';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h3 id="form-modal-title">
            {mode === 'add' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"
                style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"
                style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            )}
            {title}
          </h3>
          <button className="modal-close" onClick={onClose} aria-label="Đóng form">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body - Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">

              {/* Mã sinh viên */}
              <div className="form-group">
                <label htmlFor="studentCode">Mã sinh viên <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  id="studentCode"
                  name="studentCode"
                  type="text"
                  className={`form-control ${errors.studentCode ? 'error' : ''}`}
                  placeholder="VD: SV001"
                  value={formData.studentCode}
                  onChange={handleChange}
                  disabled={mode === 'edit'} // Không cho sửa mã SV
                />
                {errors.studentCode && <span className="error-msg">{errors.studentCode}</span>}
                {mode === 'edit' && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mã sinh viên không thể thay đổi</span>}
              </div>

              {/* Họ và tên */}
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={`form-control ${errors.fullName ? 'error' : ''}`}
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>

              {/* Số điện thoại */}
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`form-control ${errors.phone ? 'error' : ''}`}
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>

              {/* Ngày sinh */}
              <div className="form-group">
                <label htmlFor="dateOfBirth">Ngày sinh</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  className="form-control"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </div>

              {/* Giới tính */}
              <div className="form-group">
                <label htmlFor="gender">Giới tính <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select
                  id="gender"
                  name="gender"
                  className={`form-control ${errors.gender ? 'error' : ''}`}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
                {errors.gender && <span className="error-msg">{errors.gender}</span>}
              </div>

              {/* Địa chỉ */}
              <div className="form-group full-width">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-control"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading} id="student-form-submit-btn">
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Đang lưu...
                </>
              ) : mode === 'add' ? 'Thêm sinh viên' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
