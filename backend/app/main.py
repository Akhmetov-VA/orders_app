# backend/app/main.py

from datetime import timedelta
from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import auth, crud, models, schemas
from .auth import get_current_user
from .dependencies import get_db

app = FastAPI()

origins = [
    "http://localhost:3000",
    # Добавьте другие источники, если необходимо
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Эндпоинт для получения токена
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Эндпоинт для регистрации пользователя
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Проверяем, существует ли пользователь с таким именем
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Имя пользователя уже занято")
    # Проверяем, существует ли пользователь с таким email
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400, detail="Электронная почта уже используется"
        )
    hashed_password = auth.get_password_hash(user.password)
    try:
        created_user = crud.create_user(
            db=db, user=user, hashed_password=hashed_password
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Ошибка сохранения пользователя")
    return created_user


# Эндпоинт для получения информации о текущем пользователе
@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user


# Эндпоинт для получения списка пользователей (только для админа)
@app.get("/users/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    users = crud.get_users(db)
    return users


# Эндпоинт для создания заказа
@app.post("/orders/", response_model=schemas.Order)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    return crud.create_order(db=db, order=order, user_id=current_user.id)


# Эндпоинт для получения заказов текущего пользователя
@app.get("/orders/", response_model=List[schemas.Order])
def read_user_orders(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    orders = crud.get_orders_by_user(db, user_id=current_user.id)
    return orders


# Эндпоинт для получения всех заказов (только для администратора)
@app.get("/orders/all", response_model=List[schemas.Order])
def read_all_orders(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    orders = crud.get_all_orders(db)
    return orders


# Эндпоинт для получения информации о конкретном заказе
@app.get("/orders/{order_id}", response_model=schemas.Order)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    if db_order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Нет доступа к этому заказу")
    return db_order


# Эндпоинт для обновления заказа
@app.put("/orders/{order_id}", response_model=schemas.Order)
def update_order(
    order_id: int,
    order_update: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    db_order = crud.get_order(db, order_id=order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    if db_order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Нет доступа к этому заказу")
    updated_order = crud.update_order(
        db=db, order_id=order_id, order_update=order_update
    )
    if not updated_order:
        raise HTTPException(status_code=400, detail="Ошибка при обновлении заказа")
    return updated_order


# Эндпоинт для удаления заказа
@app.delete("/orders/{order_id}", response_model=schemas.Order)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    if db_order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Нет доступа к этому заказу")
    return crud.delete_order(db=db, order_id=order_id)


# Эндпоинт для получения списка названий вещей
@app.get("/items/names/", response_model=List[str])
def get_item_names(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    item_names = crud.get_item_names(db)
    return item_names


# Админские эндпоинты для управления вещами
@app.get("/admin/items/", response_model=List[schemas.Item])
def read_items(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    items = crud.get_items(db, skip=skip, limit=limit)
    return items


@app.post("/admin/items/", response_model=schemas.Item)
def create_item(
    item: schemas.ItemCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    return crud.create_admin_item(db=db, item=item)


@app.put("/admin/items/{item_id}", response_model=schemas.Item)
def update_item(
    item_id: int,
    item_update: schemas.ItemUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    updated_item = crud.update_admin_item(
        db=db, item_id=item_id, item_update=item_update
    )
    if not updated_item:
        raise HTTPException(status_code=404, detail="Вещь не найдена")
    return updated_item


@app.delete("/admin/items/{item_id}", response_model=schemas.Item)
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    deleted_item = crud.delete_admin_item(db=db, item_id=item_id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Вещь не найдена")
    return deleted_item


@app.get("/admin/items/{item_id}", response_model=schemas.Item)
def read_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    db_item = crud.get_item(db, item_id=item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Вещь не найдена")
    return db_item


# Эндпоинт для получения списка работ
@app.get("/works/", response_model=List[schemas.Work])
def read_works(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    works = crud.get_works(db, skip=skip, limit=limit)
    return works


# Дополнительные эндпоинты по необходимости...
