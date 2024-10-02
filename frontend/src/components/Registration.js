// src/components/Registration.js

import React, { useState } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/users/', {
        username,
        email,
        password,
      });
      setLoading(false);
      navigate('/');
    } catch (err) {
      setError(
        'Ошибка при регистрации: ' +
          (err.response?.data?.detail || 'Неизвестная ошибка')
      );
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Регистрация</h2>
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
          <label className="form-label">Электронная почта:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="mt-3">
        Уже есть аккаунт? <Link to="/">Войти</Link>
      </p>
    </div>
  );
}

export default Registration;
