import React from 'react';

const EmployeeModal = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{employee.name}</h2>
            <p className="modal-subtitle">{employee.role} | {employee.email}</p>
          </div>
          <button className="icon-btn close-modal-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>Date Joined</label>
              <div style={{padding: '0.75rem 0', fontWeight: '500', color: '#111827'}}>{new Date(parseInt(employee.date)).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <div style={{padding: '0.75rem 0', fontWeight: '500', color: '#111827'}}>{employee.age}</div>
            </div>
            <div className="form-group">
              <label>Class</label>
              <div style={{padding: '0.75rem 0', fontWeight: '500', color: '#111827'}}>{employee.class}</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Attendance</label>
              <div style={{
                color: employee.attendance >= 75 ? 'green' : 'orange', 
                padding: '0.75rem 0', fontWeight: '600'
              }}>
                {employee.attendance}%
              </div>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Subjects</label>
            <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap'}}>
              {employee.subjects.map(sub => (
                <span key={sub} style={{
                  background: '#f3f4f6', 
                  color: '#374151',
                  padding: '0.4rem 0.8rem', 
                  borderRadius: '20px', 
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  border: '1px solid #e5e7eb'
                }}>
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
