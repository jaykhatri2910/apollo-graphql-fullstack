import React, { useState } from 'react';

const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <h2 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Employee Manager
        </h2>
      </div>
      
      <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        {user && (
          <>
            <div className="user-info">
              <div 
                style={{
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: '#e0e7ff', 
                  color: '#4f46e5',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '0.25rem'
                }}
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                   <circle cx="12" cy="7" r="4"></circle>
                 </svg>
              </div>
              <span className="user-name">Hi, {user.name}</span>
              <span className="user-role-badge">{user.role}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
