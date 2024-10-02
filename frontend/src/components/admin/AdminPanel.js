// src/components/AdminPanel.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import ItemList from './ItemList';
import ItemCreate from './ItemCreate';
import ItemEdit from './ItemEdit';

function AdminPanel() {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  if (!currentUser || !currentUser.is_admin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="items" element={<ItemList />} />
          <Route path="items/new" element={<ItemCreate />} />
          <Route path="items/edit/:id" element={<ItemEdit />} />
          {/* Добавьте другие маршруты для работ, если необходимо */}
        </Routes>
      </div>
    </div>
  );
}

export default AdminPanel;
