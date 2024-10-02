// src/components/admin/ItemCreate.js

import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

function ItemCreate() {
  const [name, setName] = useState('');
  const [works, setWorks] = useState([{ description: '', standard_price: '' }]);
  const navigate = useNavigate();

  const handleAddWork = () => {
    setWorks([...works, { description: '', standard_price: '' }]);
  };

  const handleWorkChange = (index, field, value) => {
    const newWorks = [...works];
    newWorks[index][field] = value;
    setWorks(newWorks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemData = {
      name,
      works: works.map((work) => ({
        description: work.description,
        standard_price: parseFloat(work.standard_price),
      })),
    };

    API.post('/admin/items/', itemData)
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
        <div className="mb-3">
          <label className="form-label">Название вещи:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {works.map((work, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <h5>Работа {index + 1}</h5>
              <div className="mb-3">
                <label className="form-label">Описание работы:</label>
                <input
                  type="text"
                  className="form-control"
                  value={work.description}
                  onChange={(e) =>
                    handleWorkChange(index, 'description', e.target.value)
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Стандартная цена:</label>
                <input
                  type="number"
                  className="form-control"
                  value={work.standard_price}
                  onChange={(e) =>
                    handleWorkChange(index, 'standard_price', e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={handleAddWork}
        >
          Добавить работу
        </button>
        <br />
        <button type="submit" className="btn btn-primary">
          Создать вещь
        </button>
      </form>
    </div>
  );
}

export default ItemCreate;
