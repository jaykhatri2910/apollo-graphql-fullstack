import React from 'react';

const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name) => {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#3b82f6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const EmployeeTile = ({ employee, onEdit, onDelete, onSelect, currentUser }) => {

  const formatDate = (dateString) => {
    return new Date(parseInt(dateString)).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="tile-card" onClick={() => onSelect(employee)}>
      <div className="tile-header-main">
        <div 
          className="tile-avatar-large"
          style={{ backgroundColor: getRandomColor(employee.name) }}
        >
          {getInitials(employee.name)}
        </div>
        <div className="tile-user-info">
          <h3 className="tile-name">{employee.name}</h3>
          <span className="tile-email">{employee.email}</span>
        </div>
        
        {currentUser?.role === 'admin' && (
          <div className="tile-actions" onClick={(e) => e.stopPropagation()}>
            <button 
              className="action-btn edit"
              onClick={() => onEdit(employee)}
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button 
              className="action-btn delete"
              onClick={() => onDelete(employee.id)}
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="tile-body-stats">
        <div className="stat-item">
          <span className="stat-label">Role</span>
          <span className={`role-badge ${employee.role}`}>{employee.role}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Class</span>
          <span className="stat-value">{employee.class || 'N/A'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Attendance</span>
          <span className={`attendance-text ${
            employee.attendance >= 75 ? 'good' : employee.attendance >= 50 ? 'warning' : 'danger'
          }`}>
            {employee.attendance}%
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Joined</span>
          <span className="stat-value">{formatDate(employee.date)}</span>
        </div>
      </div>

      <div className="tile-subjects-row">
        {employee.subjects.slice(0, 3).map(sub => (
          <span key={sub} className="tile-subject-tag">{sub}</span>
        ))}
        {employee.subjects.length > 3 && (
          <span className="tile-subject-tag more">+{employee.subjects.length - 3}</span>
        )}
      </div>
    </div>
  );
};

export default EmployeeTile;
