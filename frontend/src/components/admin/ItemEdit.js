// src/components/admin/ItemEdit.js

import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

function ItemEdit() {
  const { id } = useParams();
  const [item, setItem] = useState({ name: '', works: [] });
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/admin/items/${id}`)
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке вещи', error);
      });
  }, [id]);

  const handleItemChange = (field, value) => {
    setItem((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));
  };

  const handleWorksUpdate = (works) => {
    setItem((prevItem) => ({
      ...prevItem,
      works,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API.put(`/admin/items/${id}`, item)
      .then(() => {
        navigate('/admin/items');
      })
      .catch((error) => {
        console.error('Ошибка при обновлении вещи', error);
      });
  };

  return (
    <div>
      <h2>Редактировать вещь</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Название вещи"
          value={item.name}
          onChange={(e) => handleItemChange('name', e.target.value)}
          fullWidth
          className="mb-3"
          required
        />
        {/* Таблица работ */}
        <EditableWorksTable works={item.works} setWorks={handleWorksUpdate} />
        <Button type="submit" variant="contained" color="primary">
          Сохранить изменения
        </Button>
      </form>
    </div>
  );
}

export default ItemEdit;

// Компонент EditableWorksTable такой же, как в предыдущих примерах
// Скопируйте компонент или адаптируйте его под ваши нужды
