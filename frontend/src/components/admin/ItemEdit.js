// src/components/admin/ItemEdit.js

import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

function ItemEdit() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [works, setWorks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/admin/items/${id}`)
      .then((response) => {
        const item = response.data;
        setName(item.name);
        setWorks(item.works);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке вещи', error);
      });
  }, [id]);

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

    API.put(`/admin/items/${id}`, itemData)
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
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}

export default ItemEdit;
