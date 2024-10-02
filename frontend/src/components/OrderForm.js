// src/components/OrderForm.js

import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { TextField, Checkbox, FormControlLabel, Button } from '@mui/material';

function OrderForm() {
  const [order, setOrder] = useState({
    is_urgent: false,
    receiver_id: null,
    executor_id: null,
    items: [],
  });
  const [worksList, setWorksList] = useState([]);
  const [itemNamesList, setItemNamesList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [worksResponse, itemsResponse, usersResponse] = await Promise.all([
        API.get('/works/'),
        API.get('/items/names/'),
        API.get('/users/'),
      ]);

      setWorksList(worksResponse.data);
      setItemNamesList(itemsResponse.data);
      setUsersList(usersResponse.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных', error);
    }
  };

  const handleOrderChange = (field, value) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      [field]: value,
    }));
  };

  const handleItemUpdate = (items) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/orders/', order);
      navigate('/dashboard/orders');
    } catch (error) {
      console.error('Ошибка при создании заказа', error);
      alert('Ошибка при создании заказа');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Создать заказ</h2>
      <form onSubmit={handleSubmit}>
        <FormControlLabel
          control={
            <Checkbox
              checked={order.is_urgent}
              onChange={(e) => handleOrderChange('is_urgent', e.target.checked)}
            />
          }
          label="Срочный заказ"
        />
        {/* Поля для выбора приемщика и исполнителя */}
        <div className="mb-3">
          <label className="form-label">Приемщик:</label>
          <select
            className="form-select"
            value={order.receiver_id || ''}
            onChange={(e) => handleOrderChange('receiver_id', e.target.value || null)}
          >
            <option value="">Не назначен</option>
            {usersList.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Исполнитель:</label>
          <select
            className="form-select"
            value={order.executor_id || ''}
            onChange={(e) => handleOrderChange('executor_id', e.target.value || null)}
          >
            <option value="">Не назначен</option>
            {usersList.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        {/* Таблица вещей */}
        <h3>Вещи</h3>
        <EditableItemsTable
          items={order.items}
          setItems={handleItemUpdate}
          worksList={worksList}
          itemNamesList={itemNamesList}
        />
        <Button type="submit" variant="contained" color="primary">
          Создать заказ
        </Button>
      </form>
    </div>
  );
}

export default OrderForm;

// Компонент EditableItemsTable такой же, как в OrderEdit.js
// Скопируйте компонент из предыдущего кода
