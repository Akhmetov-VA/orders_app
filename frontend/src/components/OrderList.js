// src/components/OrderList.js

import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/')
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке заказов', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Список заказов</h2>
      <Link to="/dashboard/orders/new" className="btn btn-primary mb-3">
        Создать новый заказ
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата создания</th>
            <th>Срочно</th>
            <th>Общая цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.date_created).toLocaleString()}</td>
              <td>{order.is_urgent ? 'Да' : 'Нет'}</td>
              <td>{order.total_price}</td>
              <td>
                <Link
                  to={`/dashboard/orders/edit/${order.id}`}
                  className="btn btn-sm btn-secondary me-2"
                >
                  Редактировать
                </Link>
                {/* Добавьте кнопку удаления, если необходимо */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
