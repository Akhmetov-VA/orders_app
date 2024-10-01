// src/components/OrderForm.js

import React, { useState, useEffect } from 'react';
import API from '../services/api';

function OrderForm({ history }) {
  const [isUrgent, setIsUrgent] = useState(false);
  const [items, setItems] = useState([
    {
      name: '',
      works: [
        {
          work_id: '',
          price: '',
        },
      ],
    },
  ]);
  const [worksList, setWorksList] = useState([]);

  useEffect(() => {
    // Получаем список доступных работ из бэкенда
    API.get('/works/')
      .then((response) => {
        setWorksList(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке работ', error);
      });
  }, []);

  const handleAddItem = () => {
    setItems([...items, { name: '', works: [{ work_id: '', price: '' }] }]);
  };

  const handleAddWork = (itemIndex) => {
    const newItems = [...items];
    newItems[itemIndex].works.push({ work_id: '', price: '' });
    setItems(newItems);
  };

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
    for (let i = 0; i < items.length; i++) {
      if (!items[i].name) {
        alert(`Введите название для вещи ${i + 1}`);
        return;
      }
      for (let j = 0; j < items[i].works.length; j++) {
        if (!items[i].works[j].work_id) {
          alert(
            `Выберите работу для вещи ${i + 1}, работа ${j + 1}`
          );
          return;
        }
        if (!items[i].works[j].price) {
          alert(
            `Введите цену для вещи ${i + 1}, работа ${j + 1}`
          );
          return;
        }
      }
    }

    // Формирование данных для отправки
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

    // Отправка данных на бэкенд
    API.post('/orders/', orderData)
      .then((response) => {
        history.push('/orders');
      })
      .catch((error) => {
        console.error('Ошибка при создании заказа', error);
      });
  };

  return (
    <div>
      <h2>Создать заказ</h2>
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
            <button type="button" onClick={() => handleAddWork(itemIndex)}>
              Добавить работу
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>
          Добавить вещь
        </button>
        <button type="submit">Создать заказ</button>
      </form>
    </div>
  );
}

export default OrderForm;
