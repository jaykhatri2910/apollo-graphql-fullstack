import React, { useState, useEffect } from 'react';

const EmployeeFormModal = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: '',
    subjects: '',
    attendance: '',
    role: 'employee',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        age: employee.age || '',
        class: employee.class || '',
        subjects: employee.subjects ? employee.subjects.join(', ') : '',
        attendance: employee.attendance || '',
        role: employee.role || 'employee',
        email: employee.email || '',
        password: '',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      age: parseInt(formData.age),
      attendance: parseInt(formData.attendance),
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
    };
    
    if (employee) {
      delete submissionData.password;
    }

    onSave(submissionData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
            <p className="modal-subtitle">{employee ? 'Update employee details below' : 'Enter details to create a new employee'}</p>
          </div>
          <button className="icon-btn close-modal-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <div className="form-group full-width">
              <label>Full Name</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. John Doe"
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange} 
                  placeholder="e.g. 30"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Class/Grade</label>
                <input 
                  name="class" 
                  value={formData.class} 
                  onChange={handleChange} 
                  placeholder="e.g. 10A"
                  required 
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Subjects</label>
              <input 
                name="subjects" 
                value={formData.subjects} 
                onChange={handleChange} 
                placeholder="Math, Science, History (comma separated)"
                required 
              />
              <span className="input-hint">Separate multiple subjects with commas</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Attendance (%)</label>
                <input 
                  type="number" 
                  name="attendance" 
                  value={formData.attendance} 
                  onChange={handleChange} 
                  min="0" 
                  max="100" 
                  placeholder="0-100"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <div className="select-wrapper">
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                  <svg className="select-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="john@example.com"
                required 
              />
            </div>

            {!employee && (
              <div className="form-group full-width">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="••••••••"
                  required 
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              {employee ? 'Save Changes' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
