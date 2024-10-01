// src/components/OrderEdit.js

import React, { useState, useEffect } from 'react';
import API from '../services/api';

function OrderEdit({ match, history }) {
  const orderId = match.params.id;
  const [isUrgent, setIsUrgent] = useState(false);
  const [items, setItems] = useState([]);
  const [worksList, setWorksList] = useState([]);

  useEffect(() => {
    // Получаем данные заказа
    API.get(`/orders/${orderId}`)
      .then((response) => {
        const order = response.data;
        setIsUrgent(order.is_urgent);
        setItems(order.items);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке заказа', error);
      });

    // Получаем список доступных работ
    API.get('/works/')
      .then((response) => {
        setWorksList(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке работ', error);
      });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Проверка заполнения полей
    // ...

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

    // Отправка обновленных данных на бэкенд
    API.put(`/orders/${orderId}`, orderData)
      .then((response) => {
        history.push('/orders');
      })
      .catch((error) => {
        console.error('Ошибка при обновлении заказа', error);
      });
  };

  return (
    <div>
      <h2>Редактировать заказ #{orderId}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Срочно:
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
            />
          </label>
        </div>
        {items.map((item, itemIndex) => (
          <div key={itemIndex}>
            <h3>Вещь {itemIndex + 1}</h3>
            <div>
              <label>Название вещи:</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(itemIndex, 'name', e.target.value)
                }
              />
            </div>
            {item.works.map((work, workIndex) => (
              <div key={workIndex}>
                <h4>Работа {workIndex + 1}</h4>
                <div>
                  <label>Работа:</label>
                  <select
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
                  <label>Цена:</label>
                  <input
                    type="number"
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
            {/* Добавить функционал для добавления и удаления работ */}
          </div>
        ))}
        <button type="submit">Сохранить изменения</button>
      </form>
    </div>
  );
}

export default OrderEdit;
