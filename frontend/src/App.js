// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration'; // Добавлен импорт
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import OrderEdit from './components/OrderEdit';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Маршруты, защищенные PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/new" element={<OrderForm />} />
          <Route path="/orders/edit/:id" element={<OrderEdit />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
