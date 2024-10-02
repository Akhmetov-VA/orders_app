// src/components/Main.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration'; // Добавлен импорт
import OrderForm from './OrderForm';
import OrderList from './OrderList';
import OrderEdit from './OrderEdit';
import PrivateRoute from './PrivateRoute';
import AdminPanel from './AdminPanel'; // Добавьте импорт
import Dashboard from './Dashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        {/* Маршруты, защищенные PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/new" element={<OrderForm />} />
            <Route path="/orders/edit/:id" element={<OrderEdit />} />
            <Route path="/admin/*" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

