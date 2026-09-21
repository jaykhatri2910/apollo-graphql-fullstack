import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import EmployeeGrid from './components/EmployeeGrid';
import EmployeeTile from './components/EmployeeTile';
import EmployeeModal from './components/EmployeeModal';
import EmployeeFormModal from './components/EmployeeFormModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import EmployeeProfile from './components/EmployeeProfile';

const GET_EMPLOYEES = gql`
  query GetEmployees($page: Int, $pageSize: Int, $filter: EmployeeFilter, $sortBy: EmployeeSort) {
    employees(page: $page, pageSize: $pageSize, filter: $filter, sortBy: $sortBy) {
      employees {
        id
        name
        age
        class
        subjects
        attendance
        role
        email
        date
      }
      totalCount
      totalPages
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

const ADD_EMPLOYEE = gql`
  mutation AddEmployee($name: String!, $age: Int!, $class: String!, $subjects: [String]!, $attendance: Int!, $role: String, $email: String!, $password: String!) {
    addEmployee(name: $name, age: $age, class: $class, subjects: $subjects, attendance: $attendance, role: $role, email: $email, password: $password) {
      id
      name
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $name: String, $age: Int, $class: String, $subjects: [String], $attendance: Int, $role: String, $email: String) {
    updateEmployee(id: $id, name: $name, age: $age, class: $class, subjects: $subjects, attendance: $attendance, role: $role, email: $email) {
      id
      name
    }
  }
`;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'tile' : 'grid'); // 'grid' (List) or 'tile' (Cards)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('tile');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({});
  const [sortBy, setSortBy] = useState({ field: 'date', order: 'desc' });

  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: { page, pageSize: 10, filter, sortBy },
    skip: !token,
  });

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => {
      refetch();
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
    },
    onError: (err) => alert('Failed to delete: ' + err.message)
  });

  const [addEmployee] = useMutation(ADD_EMPLOYEE, {
    onCompleted: () => {
      refetch();
      setIsFormOpen(false);
    },
    onError: (err) => alert('Failed to add: ' + err.message),
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => {
      refetch();
      setIsFormOpen(false);
      setEditingEmployee(null);
    },
    onError: (err) => alert('Failed to update: ' + err.message),
  });

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
    refetch(); // Refetch data specifically for the new user
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const confirmDelete = (id) => {
    // Find employee name for display
    const emp = data?.employees?.employees.find(e => e.id === id);
    setEmployeeToDelete({ id, name: emp ? emp.name : 'this employee' });
    setDeleteModalOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee({ variables: { id: employeeToDelete.id } });
      } catch (err) {
        // Error handled in mutation hook
      }
    }
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleSave = async (data) => {
    if (editingEmployee) {
      await updateEmployee({ variables: { id: editingEmployee.id, ...data } });
    } else {
      await addEmployee({ variables: data });
    }
  };

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="main-content">
        {user?.role === 'admin' && (
          <div className="controls-bar">
            <div className="view-toggle-group">
              <button 
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')} 
                title="List View"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                <span>List</span>
              </button>
              <button 
                className={`view-toggle-btn ${viewMode === 'tile' ? 'active' : ''}`}
                onClick={() => setViewMode('tile')}
                title="Grid View"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Grid</span>
              </button>
            </div>
            
            <div className="actions-group">
              <div className="search-wrapper">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search employees..." 
                  onChange={(e) => setFilter({...filter, name: e.target.value})}
                />
              </div>

              <div className="sort-wrapper">
                <svg className="sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
                <select onChange={(e) => setSortBy({ field: e.target.value, order: sortBy.order })}>
                  <option value="date">Date Joined</option>
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                  <option value="attendance">Attendance</option>
                </select>
              </div>

              <button 
                className="icon-btn-bordered"
                onClick={() => setSortBy({...sortBy, order: sortBy.order === 'asc' ? 'desc' : 'asc'})}
                title={`Sort ${sortBy.order === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortBy.order === 'asc' ? (
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
                ) : (
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>
                )}
              </button>

              <button className="btn-primary add-btn" onClick={handleAdd}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Employee
              </button>
            </div>
          </div>
        )}

        {loading && <p>Loading...</p>}
        {error && <p style={{color: 'red'}}>Error: {error.message}</p>}

        {data && (
          <>
            {user?.role === 'admin' ? (
              <>
                {viewMode === 'grid' ? (
                  <EmployeeGrid 
                    employees={data.employees.employees} 
                    onEdit={handleEdit} 
                    onDelete={confirmDelete}
                    onSelect={setSelectedEmployee}
                    currentUser={user}
                  />
                ) : (
                  <div className="employee-tiles">
                    {data.employees.employees.map(emp => (
                      <EmployeeTile 
                        key={emp.id} 
                        employee={emp} 
                        onEdit={handleEdit} 
                        onDelete={confirmDelete}
                        onSelect={setSelectedEmployee}
                        currentUser={user}
                      />
                    ))}
                  </div>
                )}
                
                {data.employees.totalCount > 0 ? (
                  <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                    <span>Page {page} of {data.employees.totalPages}</span>
                    <button disabled={page === data.employees.totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
                  </div>
                ) : (
                  <div style={{textAlign: 'center', marginTop: '3rem', color: '#6b7280', fontSize: '1.1rem'}}>
                    No employees found matching your search.
                  </div>
                )}
              </>
            ) : (
              // Employee View
              data.employees.employees.length > 0 ? (
                <EmployeeProfile 
                  employee={data.employees.employees[0]} 
                  onUpdate={(updates) => updateEmployee({ 
                    variables: { id: data.employees.employees[0].id, ...updates } 
                  })}
                />
              ) : (
                <div style={{textAlign: 'center', marginTop: '3rem', color: '#6b7280'}}>
                  Profile not found.
                </div>
              )
            )}
          </>
        )}
      </main>

      {selectedEmployee && (
        <EmployeeModal 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
        />
      )}

      {isFormOpen && (
        <EmployeeFormModal
          employee={editingEmployee}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}

      {deleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleExecuteDelete}
          employeeName={employeeToDelete?.name}
        />
      )}
    </div>
  );
}

export default App;
