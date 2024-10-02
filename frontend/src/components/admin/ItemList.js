// src/components/admin/ItemList.js

import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

function ItemList() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/admin/items/')
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке вещей', error);
      });
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, editable: false },
    {
      field: 'name',
      headerName: 'Название',
      width: 200,
      editable: true,
    },
  ];

  const processRowUpdate = async (newRow) => {
    try {
      await API.put(`/admin/items/${newRow.id}`, newRow);
      return newRow;
    } catch (error) {
      console.error('Ошибка при обновлении вещи', error);
      return items.find((item) => item.id === newRow.id);
    }
  };

  const handleRowDelete = async (id) => {
    try {
      await API.delete(`/admin/items/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении вещи', error);
    }
  };

  return (
    <div>
      <h2>Список вещей</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate('/admin/items/new')}
      >
        Добавить новую вещь
      </button>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          experimentalFeatures={{ newEditingApi: true }}
          processRowUpdate={processRowUpdate}
          onRowDoubleClick={(params) => navigate(`/admin/items/edit/${params.id}`)}
          components={{
            Toolbar: () => (
              <div>
                {/* Добавьте дополнительные элементы управления, если необходимо */}
              </div>
            ),
          }}
          onRowDelete={(params) => handleRowDelete(params.id)}
        />
      </div>
    </div>
  );
}

export default ItemList;
