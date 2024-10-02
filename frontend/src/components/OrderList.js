// src/components/OrderList.js

import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/orders/')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке заказов', error);
      });
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, editable: false },
    {
      field: 'date_created',
      headerName: 'Дата создания',
      width: 200,
      valueGetter: (params) => new Date(params.row.date_created).toLocaleString(),
      editable: false,
    },
    {
      field: 'is_urgent',
      headerName: 'Срочно',
      width: 100,
      type: 'boolean',
      editable: true,
    },
    {
      field: 'total_price',
      headerName: 'Общая цена',
      width: 130,
      editable: false,
    },
    {
      field: 'receiver',
      headerName: 'Приемщик',
      width: 150,
      valueGetter: (params) => params.row.receiver?.username || '',
      editable: false,
    },
    {
      field: 'executor',
      headerName: 'Исполнитель',
      width: 150,
      valueGetter: (params) => params.row.executor?.username || '',
      editable: false,
    },
  ];

  const processRowUpdate = async (newRow) => {
    // Отправляем изменения на сервер
    try {
      await API.put(`/orders/${newRow.id}`, {
        ...newRow,
        items: newRow.items, // Если есть изменения в items, нужно обработать отдельно
      });
      return newRow;
    } catch (error) {
      console.error('Ошибка при обновлении заказа', error);
      return orders.find((order) => order.id === newRow.id);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Список заказов</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate('/dashboard/orders/new')}
      >
        Создать новый заказ
      </button>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          experimentalFeatures={{ newEditingApi: true }}
          processRowUpdate={processRowUpdate}
          onRowDoubleClick={(params) => navigate(`/dashboard/orders/edit/${params.id}`)}
        />
      </div>
    </div>
  );
}

export default OrderList;
