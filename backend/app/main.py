# backend/app/main.py

from datetime import timedelta  # Добавлено
from typing import List  # Добавлено

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import auth, crud, models, schemas
from .auth import get_current_user, oauth2_scheme
from .database import SessionLocal, engine
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
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Имя пользователя уже занято")
    hashed_password = auth.get_password_hash(user.password)
    created_user = crud.create_user(db=db, user=user, hashed_password=hashed_password)
    return schemas.User.model_validate(created_user)


# Эндпоинт для получения информации о текущем пользователе
@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user


# Эндпоинт для создания заказа
@app.get("/orders/", response_model=List[schemas.Order])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    orders = crud.get_orders_by_user(db, user_id=current_user.id)
    return [schemas.Order.model_validate(order) for order in orders]


# Эндпоинт для получения заказов текущего пользователя
@app.get("/orders/", response_model=List[schemas.Order])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    orders = crud.get_orders_by_user(db, user_id=current_user.id)
    return orders


# Эндпоинт для обновления заказа
@app.put("/orders/{order_id}", response_model=schemas.Order)
def update_order(
    order_id: int,
    order: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    db_order = crud.get_order(db, order_id=order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    if db_order.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Нет доступа к этому заказу")
    return crud.update_order(db=db, order_id=order_id, order_update=order)


# Эндпоинты для работ
@app.get("/works/", response_model=List[schemas.Work])
def read_works(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    works = crud.get_works(db, skip=skip, limit=limit)
    return works


@app.post("/works/", response_model=schemas.Work)
def create_work(
    work: schemas.WorkCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    return crud.create_work(db=db, work=work)


# Эндпоинт для получения списка пользователей (только для админа)
@app.get("/users/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    users = db.query(models.User).all()
    return users
