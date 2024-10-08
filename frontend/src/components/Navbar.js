// src/components/Navbar.js

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const currentUser = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/dashboard/orders">
          Мое Приложение
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Переключить навигацию"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {/* Общие ссылки */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard/orders">
                Заказы
              </NavLink>
            </li>
            {/* Администраторские ссылки */}
            {currentUser && currentUser.is_admin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/items">
                  Админ-панель
                </NavLink>
              </li>
            )}
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

export default Navbar;
