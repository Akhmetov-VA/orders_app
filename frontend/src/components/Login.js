// src/components/Login.js

import React, { useState } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState(''); // Инициализируем состояние для имени пользователя
  const [password, setPassword] = useState(''); // Инициализируем состояние для пароля
  const [error, setError] = useState(''); // Инициализируем состояние для ошибок
  const [loading, setLoading] = useState(false); // Добавлено состояние загрузки
  const navigate = useNavigate(); // Хук для навигации

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Начало загрузки
    try {
      // Получение токена
      const response = await API.post(
        '/token',
        new URLSearchParams({
          username,
          password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      localStorage.setItem('token', response.data.access_token);

      // Получение информации о пользователе
      const userResponse = await API.get('/users/me/', {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });
      const user = userResponse.data;
      localStorage.setItem('user', JSON.stringify(user));

      setLoading(false); // Окончание загрузки
      navigate('/dashboard/orders');
    } catch (err) {
      setError(
        'Неверное имя пользователя или пароль: ' +
          (err.response?.data?.detail || 'Неизвестная ошибка')
      );
      setLoading(false); // Окончание загрузки при ошибке
    }
  };

  return (
    <div className="container mt-5">
      <h2>Вход в систему</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Имя пользователя:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Пароль:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
      <p className="mt-3">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}

export default Login;
