#!/bin/bash
set -e

# Ждём, пока база данных станет доступна
until pg_isready -h db -p 5432; do
  echo "Ждём, пока база данных станет доступна..."
  sleep 2
done

# Запускаем миграции (если используете Alembic)
# alembic upgrade head

# Создаём администратора
python -m app.create_admin

# Запускаем приложение
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
