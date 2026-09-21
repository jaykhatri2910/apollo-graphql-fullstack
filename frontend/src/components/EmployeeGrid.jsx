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

const EmployeeGrid = ({ employees, onEdit, onDelete, onSelect, currentUser }) => {
  return (
    <div className="employee-grid-container">
      <div className="employee-grid">
        <div className="grid-header">
          <div className="grid-cell name-col">Name</div>
          <div className="grid-cell">Age</div>
          <div className="grid-cell">Class</div>
          <div className="grid-cell subjects-col">Subjects</div>
          <div className="grid-cell">Attendance</div>
          <div className="grid-cell">Role</div>
          <div className="grid-cell">Joined</div>
          <div className="grid-cell actions-col"></div>
        </div>
        
        {employees.map(emp => (
          <div key={emp.id} className="grid-row" onClick={() => onSelect(emp)}>
            <div className="grid-cell name-col">
              <div 
                className="avatar" 
                style={{ backgroundColor: getRandomColor(emp.name) }}
              >
                {getInitials(emp.name)}
              </div>
              <div className="name-info">
                <span className="name-text">{emp.name}</span>
                <span className="email-text">{emp.email}</span>
              </div>
            </div>
            
            <div className="grid-cell">{emp.age}</div>
            <div className="grid-cell">{emp.class}</div>
            
            <div className="grid-cell subjects-col">
              <div className="subjects-wrapper">
                {emp.subjects.slice(0, 2).map(sub => (
                  <span key={sub} className="subject-tag">{sub}</span>
                ))}
                {emp.subjects.length > 2 && (
                  <span className="subject-tag more">+{emp.subjects.length - 2}</span>
                )}
              </div>
            </div>
            
            <div className="grid-cell">
              <span className={`attendance-badge ${emp.attendance >= 75 ? 'good' : emp.attendance >= 50 ? 'warning' : 'danger'}`}>
                {emp.attendance}%
              </span>
            </div>
            
            <div className="grid-cell">
              <span className={`role-badge ${emp.role}`}>
                {emp.role}
              </span>
            </div>

            <div className="grid-cell table-date">
              {new Date(parseInt(emp.date)).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
            
            <div className="grid-cell actions-col" onClick={(e) => e.stopPropagation()}>
              {currentUser?.role === 'admin' && (
                <div className="action-buttons">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(emp); }} 
                    className="action-btn edit"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(emp.id); }} 
                    className="action-btn delete"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeGrid;
