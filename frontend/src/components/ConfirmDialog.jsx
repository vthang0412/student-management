/**
 * ConfirmDialog Component
 * Modal xác nhận hành động nguy hiểm (xóa sinh viên)
 * Props:
 *   - isOpen: boolean
 *   - title: string
 *   - message: string
 *   - onConfirm: () => void
 *   - onCancel: () => void
 *   - confirmLabel: string (default: "Xác nhận")
 *   - isLoading: boolean
 */
const ConfirmDialog = ({
  isOpen,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này không?',
  onConfirm,
  onCancel,
  confirmLabel = 'Xác nhận',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal modal-sm">
        <div className="modal-header">
          <h3 id="confirm-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"
              style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {title}
          </h3>
          <button className="modal-close" onClick={onCancel} aria-label="Đóng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
            Hủy
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isLoading} id="confirm-dialog-btn">
            {isLoading ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Đang xử lý...
              </>
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
