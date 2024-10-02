// src/components/OrderEdit.js

import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Checkbox, FormControlLabel, Button } from '@mui/material';

function OrderEdit() {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [worksList, setWorksList] = useState([]);
  const [itemNamesList, setItemNamesList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [orderId]);

  const fetchData = async () => {
    try {
      const [orderResponse, worksResponse, itemsResponse, usersResponse] = await Promise.all([
        API.get(`/orders/${orderId}`),
        API.get('/works/'),
        API.get('/items/names/'),
        API.get('/users/'),
      ]);

      setOrder(orderResponse.data);
      setWorksList(worksResponse.data);
      setItemNamesList(itemsResponse.data);
      setUsersList(usersResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке данных', error);
      alert('Ошибка при загрузке данных');
      setLoading(false);
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
      await API.put(`/orders/${orderId}`, order);
      navigate('/dashboard/orders');
    } catch (error) {
      console.error('Ошибка при обновлении заказа', error);
      alert('Ошибка при обновлении заказа');
    }
  };

  if (loading || !order) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Редактировать заказ #{orderId}</h2>
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
          Сохранить изменения
        </Button>
      </form>
    </div>
  );
}

export default OrderEdit;

// Компонент для редактирования вещей и работ
function EditableItemsTable({ items, setItems, worksList, itemNamesList }) {
  const [itemRows, setItemRows] = useState([]);

  useEffect(() => {
    setItemRows(items.map((item, index) => ({ id: index, ...item })));
  }, [items]);

  const handleItemRowUpdate = (newRow) => {
    const updatedItems = [...itemRows];
    const index = updatedItems.findIndex((item) => item.id === newRow.id);
    updatedItems[index] = newRow;
    setItemRows(updatedItems);
    setItems(updatedItems.map(({ id, ...rest }) => rest));
  };

  const handleAddItem = () => {
    const newItem = {
      id: itemRows.length,
      name: '',
      works: [],
    };
    const updatedItems = [...itemRows, newItem];
    setItemRows(updatedItems);
    setItems(updatedItems.map(({ id, ...rest }) => rest));
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleAddItem} className="mb-3">
        Добавить вещь
      </Button>
      {itemRows.map((item) => (
        <div key={item.id} className="mb-4">
          <TextField
            label="Название вещи"
            value={item.name}
            onChange={(e) => {
              const newItem = { ...item, name: e.target.value };
              handleItemRowUpdate(newItem);
            }}
            fullWidth
            className="mb-2"
          />
          <EditableWorksTable
            works={item.works}
            setWorks={(newWorks) => {
              const newItem = { ...item, works: newWorks };
              handleItemRowUpdate(newItem);
            }}
            worksList={worksList}
          />
        </div>
      ))}
    </div>
  );
}

function EditableWorksTable({ works, setWorks, worksList }) {
  const [workRows, setWorkRows] = useState([]);

  useEffect(() => {
    setWorkRows(works.map((work, index) => ({ id: index, ...work })));
  }, [works]);

  const handleWorkRowUpdate = (newRow) => {
    const updatedWorks = [...workRows];
    const index = updatedWorks.findIndex((work) => work.id === newRow.id);
    updatedWorks[index] = newRow;
    setWorkRows(updatedWorks);
    setWorks(updatedWorks.map(({ id, ...rest }) => rest));
  };

  const handleAddWork = () => {
    const newWork = {
      id: workRows.length,
      work_id: '',
      price: '',
    };
    const updatedWorks = [...workRows, newWork];
    setWorkRows(updatedWorks);
    setWorks(updatedWorks.map(({ id, ...rest }) => rest));
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleAddWork} className="mb-2">
        Добавить работу
      </Button>
      {workRows.map((work) => (
        <div key={work.id} className="mb-2">
          <div className="row">
            <div className="col-md-6">
              <select
                className="form-select"
                value={work.work_id || ''}
                onChange={(e) => {
                  const newWork = { ...work, work_id: parseInt(e.target.value) };
                  handleWorkRowUpdate(newWork);
                }}
              >
                <option value="">Выберите работу</option>
                {worksList.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <TextField
                label="Цена"
                type="number"
                value={work.price}
                onChange={(e) => {
                  const newWork = { ...work, price: e.target.value };
                  handleWorkRowUpdate(newWork);
                }}
                fullWidth
              />
            </div>
            <div className="col-md-2">
              <Button
                variant="text"
                color="error"
                onClick={() => {
                  const updatedWorks = workRows.filter((w) => w.id !== work.id);
                  setWorkRows(updatedWorks);
                  setWorks(updatedWorks.map(({ id, ...rest }) => rest));
                }}
              >
                Удалить
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
