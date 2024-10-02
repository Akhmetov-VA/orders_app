// src/components/OrderEdit.js

import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

function OrderEdit() {
  const { id: orderId } = useParams();
  const [isUrgent, setIsUrgent] = useState(false);
  const [items, setItems] = useState([]);
  const [worksList, setWorksList] = useState([]);
  const [itemNamesList, setItemNamesList] = useState([]); // Список названий вещей
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем данные заказа
        const orderResponse = await API.get(`/orders/${orderId}`);
        const order = orderResponse.data;
        setIsUrgent(order.is_urgent);
        setItems(order.items);

        // Получаем список доступных работ
        const worksResponse = await API.get('/works/');
        setWorksList(worksResponse.data);

        // Получаем список названий вещей
        const itemsResponse = await API.get('/items/names/');
        setItemNamesList(itemsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных', error);
        alert('Ошибка при загрузке данных');
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleWorkChange = (itemIndex, workIndex, field, value) => {
    const newItems = [...items];
    newItems[itemIndex].works[workIndex][field] = value;
    setItems(newItems);
  };

  const handleAddWork = (itemIndex) => {
    const newItems = [...items];
    newItems[itemIndex].works.push({ work_id: '', price: '' });
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Проверка заполнения полей
    for (let i = 0; i < items.length; i++) {
      if (!items[i].name) {
        alert(`Введите или выберите название для вещи ${i + 1}`);
        return;
      }
      for (let j = 0; j < items[i].works.length; j++) {
        if (!items[i].works[j].work_id) {
          alert(`Выберите работу для вещи ${i + 1}, работа ${j + 1}`);
          return;
        }
        if (!items[i].works[j].price) {
          alert(`Введите цену для вещи ${i + 1}, работа ${j + 1}`);
          return;
        }
      }
    }

    const orderData = {
      is_urgent: isUrgent,
      items: items.map((item) => ({
        name: item.name,
        works: item.works.map((work) => ({
          work_id: parseInt(work.work_id),
          price: parseFloat(work.price),
        })),
      })),
    };

    try {
      await API.put(`/orders/${orderId}`, orderData);
      navigate('/dashboard/orders');
    } catch (error) {
      console.error('Ошибка при обновлении заказа', error);
      alert('Ошибка при обновлении заказа');
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Редактировать заказ #{orderId}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            id="urgentCheck"
          />
          <label className="form-check-label" htmlFor="urgentCheck">
            Срочный заказ
          </label>
        </div>
        {items.map((item, itemIndex) => (
          <div key={itemIndex} className="card mb-3">
            <div className="card-body">
              <h3>Вещь {itemIndex + 1}</h3>
              <div className="mb-3">
                <label className="form-label">Название вещи:</label>
                <select
                  className="form-select mb-2"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(itemIndex, 'name', e.target.value)
                  }
                >
                  <option value="">Выберите вещь</option>
                  {itemNamesList.map((name, idx) => (
                    <option key={idx} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Или введите вручную"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(itemIndex, 'name', e.target.value)
                  }
                />
              </div>
              {item.works.map((work, workIndex) => (
                <div key={workIndex} className="mb-3">
                  <h4>Работа {workIndex + 1}</h4>
                  <div className="mb-2">
                    <label className="form-label">Работа:</label>
                    <select
                      className="form-select"
                      value={work.work_id}
                      onChange={(e) =>
                        handleWorkChange(
                          itemIndex,
                          workIndex,
                          'work_id',
                          e.target.value
                        )
                      }
                    >
                      <option value="">Выберите работу</option>
                      {worksList.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Цена:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={work.price}
                      onChange={(e) =>
                        handleWorkChange(
                          itemIndex,
                          workIndex,
                          'price',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleAddWork(itemIndex)}
              >
                Добавить работу
              </button>
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}

export default OrderEdit;
