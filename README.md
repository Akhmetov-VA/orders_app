# Шаг 1: Настройка структуры проекта
## Создайте директории для бэкенда и фронтенда:

```bash
mkdir my_app
cd my_app
mkdir backend frontend
```

# Шаг 2: Разработка бэкенда на FastAPI
## 2.1 Инициализация проекта

Перейдите в директорию backend и создайте виртуальное окружение:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Для Unix/Linux
```

# 2.2 Установка зависимостей

Установите необходимые пакеты:

```bash
pip install fastapi uvicorn[standard] sqlalchemy alembic psycopg2-binary passlib[bcrypt] python-jose
```

# 2.3 Структура файлов

Создайте следующую структуру каталогов и файлов:

```css
backend/
├── app/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── database.py
│   ├── dependencies.py
│   └── auth.py
├── alembic/
├── Dockerfile
└── requirements.txt
```

# 2.4 Настройка базы данных

database.py

```python
# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://postgres:postgres@db:5432/postgres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```