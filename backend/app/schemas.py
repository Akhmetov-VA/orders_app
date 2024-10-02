# backend/app/schemas.py

import datetime

# backend/app/schemas.py
from typing import List, Optional

from pydantic import BaseModel


class ItemWorkCreate(BaseModel):
    work_id: int
    price: float


class ItemCreate(BaseModel):
    name: str
    works: List[ItemWorkCreate]


class OrderCreate(BaseModel):
    is_urgent: bool
    items: List[ItemCreate]


# Схема для токена
class Token(BaseModel):
    access_token: str
    token_type: str


class WorkBase(BaseModel):
    type_id: int
    category_id: int
    description: str
    standard_price: float


class WorkCreate(WorkBase):
    pass


class Work(WorkBase):
    id: int

    class Config:
        from_attributes = True


class ItemWorkBase(BaseModel):
    work_id: int
    price: float


class ItemWorkCreate(ItemWorkBase):
    pass


class ItemWork(ItemWorkBase):
    item_id: int
    work: Work

    class Config:
        from_attributes = True


class ItemBase(BaseModel):
    name: str


class ItemCreate(ItemBase):
    works: List[ItemWorkCreate]


class Item(ItemBase):
    id: int
    works: List[ItemWork]

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    is_urgent: bool


class OrderCreate(OrderBase):
    items: List[ItemCreate]


class Order(OrderBase):
    id: int
    date_created: datetime.datetime
    total_price: float
    items: List[Item]

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_admin: bool  # Новое поле
    orders: List[Order] = []

    class Config:
        from_attributes = True
