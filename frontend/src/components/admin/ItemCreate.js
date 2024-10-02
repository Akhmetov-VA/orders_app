// src/components/admin/ItemCreate.js

import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

function ItemCreate() {
  const [item, setItem] = useState({ name: '', works: [] });
  const navigate = useNavigate();

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
    API.post('/admin/items/', item)
      .then(() => {
        navigate('/admin/items');
      })
      .catch((error) => {
        console.error('Ошибка при создании вещи', error);
      });
  };

  return (
    <div>
      <h2>Добавить новую вещь</h2>
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
          Создать вещь
        </Button>
      </form>
    </div>
  );
}

export default ItemCreate;
