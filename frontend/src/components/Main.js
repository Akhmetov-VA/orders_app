// src/components/Main.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import PrivateRoute from './PrivateRoute';
import Dashboard from './Dashboard';
import Orders from './Orders';
import OrderForm from './OrderForm';
import OrderEdit from './OrderEdit';
import AdminPanel from './admin/AdminPanel';

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route path="orders" element={<Orders />} />
            <Route path="orders/new" element={<OrderForm />} />
            <Route path="orders/edit/:id" element={<OrderEdit />} />
            {/* Добавьте другие маршруты по необходимости */}
          </Route>
          <Route path="/admin/*" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Main;
