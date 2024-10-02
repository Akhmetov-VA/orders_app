# backend/app/create_admin.py

import os

from app.auth import get_password_hash
from app.database import SessionLocal
from app.models import User


def create_admin():
    db = SessionLocal()
    try:
        username = os.getenv("ADMIN_USERNAME", "admin")
        email = os.getenv("ADMIN_EMAIL", "admin@example.com")
        password = os.getenv("ADMIN_PASSWORD", "adminpass")

        # Проверяем, существует ли пользователь с таким именем
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"Пользователь {username} уже существует.")
            return

        hashed_password = get_password_hash(password)
        admin_user = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            is_admin=True,
        )
        db.add(admin_user)
        db.commit()
        print(f"Администратор {username} успешно создан.")
    except Exception as e:
        print(f"Ошибка при создании администратора: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()
