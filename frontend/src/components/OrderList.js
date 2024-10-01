// src/components/OrderList.js

import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/orders/')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке заказов', error);
      });
  }, []);

  return (
    <div>
      <h2>Список заказов</h2>
      <Link to="/orders/new">Создать новый заказ</Link>
      <table>
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
                <Link to={`/orders/edit/${order.id}`}>Редактировать</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
