// src/components/Registration.js

import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Добавлено состояние загрузки

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Начало загрузки
    try {
      await API.post('/users/', {
        username,
        email,
        password,
      });
      setLoading(false); // Окончание загрузки
      navigate('/');
    } catch (err) {
      setError(
        'Ошибка при регистрации: ' +
          (err.response?.data?.detail || 'Неизвестная ошибка')
      );
      setLoading(false); // Окончание загрузки при ошибке
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя пользователя:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Электронная почта:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
}

export default Registration;
