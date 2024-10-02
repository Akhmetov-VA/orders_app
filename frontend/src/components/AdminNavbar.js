// src/components/AdminNavbar.js

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/admin/items">
          Админ-панель
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbarNav"
          aria-controls="adminNavbarNav"
          aria-expanded="false"
          aria-label="Переключить навигацию"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/items">
                Вещи
              </NavLink>
            </li>
            {/* Добавьте другие пункты меню, если необходимо */}
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                Выйти
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
