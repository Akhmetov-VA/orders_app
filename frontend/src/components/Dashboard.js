// src/components/Dashboard.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
