// src/components/Main.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import Dashboard from './Dashboard';
import Orders from './Orders';
import OrderForm from './OrderForm';
import OrderEdit from './OrderEdit';
import Profile from './Profile';
import Works from './Works';
import PrivateRoute from './PrivateRoute';

function Main() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<OrderForm />} />
          <Route path="orders/edit/:id" element={<OrderEdit />} />
          <Route path="profile" element={<Profile />} />
          <Route path="works" element={<Works />} />
          {/* Добавьте другие маршруты по необходимости */}
        </Route>
      </Route>
    </Routes>
  );
}

export default Main;
