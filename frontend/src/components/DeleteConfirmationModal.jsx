import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, employeeName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{maxWidth: '400px'}}
      >
        <div className="modal-header" style={{borderBottom: 'none', paddingBottom: '0'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <div style={{
              background: '#fee2e2', 
              padding: '0.5rem', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h2 style={{fontSize: '1.25rem'}}>Delete Employee</h2>
          </div>
        </div>
        
        <div style={{padding: '1rem 2rem 2rem 2rem'}}>
          <p style={{margin: 0, color: '#4b5563', lineHeight: '1.5'}}>
            Are you sure you want to delete <span style={{fontWeight: '600', color: '#111827'}}>{employeeName}</span>? 
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer" style={{background: '#f9fafb', borderRadius: '0 0 16px 16px'}}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
