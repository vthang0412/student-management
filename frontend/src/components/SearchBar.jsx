import { useRef, useEffect } from 'react';

/**
 * SearchBar Component
 * Ô tìm kiếm sinh viên theo mã SV hoặc họ tên
 * Props:
 *   - value: string
 *   - onChange: (val: string) => void
 *   - onSearch: () => void  (gọi khi nhấn Enter hoặc icon search)
 *   - isLoading: boolean
 */
const SearchBar = ({ value, onChange, onSearch, isLoading }) => {
  const inputRef = useRef(null);

  // Focus khi component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch?.();
    if (e.key === 'Escape') onChange('');
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="search-wrap" role="search">
      {/* Icon search */}
      {isLoading ? (
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
          <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
        </span>
      ) : (
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )}

      <input
        ref={inputRef}
        id="student-search-input"
        type="text"
        className="search-input"
        placeholder="Tìm theo mã SV hoặc họ tên..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Tìm kiếm sinh viên"
      />

      {/* Nút xóa khi có giá trị */}
      {value && (
        <button
          onClick={handleClear}
          aria-label="Xóa tìm kiếm"
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex', padding: 2,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
