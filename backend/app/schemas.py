# backend/app/schemas.py

import datetime
from typing import List, Optional

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_admin: bool

    class Config:
        orm_mode = True


class WorkBase(BaseModel):
    description: str
    standard_price: float


class WorkCreate(WorkBase):
    pass


class Work(WorkBase):
    id: int

    class Config:
        orm_mode = True


class ItemWorkBase(BaseModel):
    work_id: int
    price: float


class ItemWorkCreate(ItemWorkBase):
    pass


class ItemWork(ItemWorkBase):
    id: int
    work: Work

    class Config:
        orm_mode = True


class ItemBase(BaseModel):
    name: str


class ItemCreate(ItemBase):
    works: List[ItemWorkCreate]


class Item(ItemBase):
    id: int
    works: List[ItemWork]

    class Config:
        orm_mode = True


class ItemUpdate(ItemBase):
    works: List[ItemWorkCreate]


class OrderBase(BaseModel):
    is_urgent: bool
    receiver_id: Optional[int] = None
    executor_id: Optional[int] = None


class OrderCreate(OrderBase):
    items: List[ItemCreate]


class Order(OrderBase):
    id: int
    date_created: datetime.datetime
    total_price: Optional[float] = None
    items: List[Item]
    owner: User
    receiver: Optional[User] = None
    executor: Optional[User] = None

    class Config:
        orm_mode = True
