// src/components/admin/ItemList.js

import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';

function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get('/admin/items/')
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке вещей', error);
      });
  }, []);

  return (
    <div>
      <h2>Список вещей</h2>
      <Link to="/admin/items/new" className="btn btn-primary mb-3">
        Добавить новую вещь
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <Link
                  to={`/admin/items/edit/${item.id}`}
                  className="btn btn-sm btn-secondary me-2"
                >
                  Редактировать
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    API.delete(`/admin/items/${item.id}`)
                      .then(() => {
                        setItems(items.filter((i) => i.id !== item.id));
                      })
                      .catch((error) => {
                        console.error('Ошибка при удалении вещи', error);
                      });
                  }}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemList;
