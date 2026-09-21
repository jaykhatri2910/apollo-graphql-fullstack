import React, { useState } from 'react';

const EmployeeProfile = ({ employee, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(employee ? employee.name : '');

  if (!employee) return null;

  const handleSave = () => {
    onUpdate({ name });
    setIsEditing(false);
  };

  return (
    <div style={{
      background: 'var(--card-bg)',
      borderRadius: '16px',
      maxWidth: '800px',
      margin: '2rem auto',
      boxShadow: 'var(--shadow)',
      padding: '3rem'
    }}>
      <div style={{
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <h2 style={{margin: 0, fontSize: '2rem', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            My Profile
          </h2>
          {isEditing ? (
            <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
               <input 
                 type="text" 
                 value={name} 
                 onChange={(e) => setName(e.target.value)}
                 style={{
                   padding: '0.5rem',
                   fontSize: '1rem',
                   borderRadius: '4px',
                   border: '1px solid var(--border-color)'
                 }}
               />
               <button onClick={handleSave} className="btn-primary" style={{padding: '0.5rem 1rem'}}>Save</button>
               <button onClick={() => setIsEditing(false)} className="btn-secondary" style={{padding: '0.5rem 1rem'}}>Cancel</button>
            </div>
          ) : (
             <div style={{margin: '0.5rem 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
               <p style={{margin: 0, color: '#6b7280', fontSize: '1.1rem'}}>{employee.name} | {employee.role}</p>
               <button 
                 onClick={() => { setName(employee.name); setIsEditing(true); }}
                 title="Edit Name"
                 style={{
                   background: 'none',
                   border: 'none',
                   cursor: 'pointer',
                   color: '#646cff',
                   padding: 0,
                   display: 'flex',
                   alignItems: 'center'
                 }}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                   <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                 </svg>
               </button>
             </div>
          )}
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
        <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '2rem'
        }}>
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Email</label>
            <div style={{fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-color)', wordBreak: 'break-all'}}>{employee.email}</div>
          </div>
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Date Joined</label>
            <div style={{fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-color)'}}>{new Date(parseInt(employee.date)).toLocaleDateString()}</div>
          </div>
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Age</label>
            <div style={{fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-color)'}}>{employee.age}</div>
          </div>
          <div>
             <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Class</label>
             <div style={{fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-color)'}}>{employee.class}</div>
          </div>
          <div>
             <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Attendance</label>
             <div style={{
                fontSize: '1.1rem', 
                fontWeight: 600,
                color: employee.attendance >= 75 ? 'green' : 'orange'
             }}>{employee.attendance}%</div>
          </div>
        </div>

        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Subjects</label>
          <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
            {employee.subjects.map(sub => (
              <span key={sub} style={{
                background: '#f3f4f6', 
                color: '#374151',
                padding: '0.6rem 1.2rem', 
                borderRadius: '9999px', 
                fontSize: '0.95rem',
                fontWeight: '500',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                {sub}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
