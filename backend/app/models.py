# backend/app/models.py

import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    is_admin = Column(Boolean, default=False)
    orders = relationship("Order", back_populates="owner", foreign_keys="Order.user_id")
    received_orders = relationship(
        "Order", back_populates="receiver", foreign_keys="Order.receiver_id"
    )
    executed_orders = relationship(
        "Order", back_populates="executor", foreign_keys="Order.executor_id"
    )


class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id"), nullable=False
    )  # Создатель заказа
    receiver_id = Column(
        Integer, ForeignKey("users.id"), nullable=True
    )  # Приёмщик заказа
    executor_id = Column(
        Integer, ForeignKey("users.id"), nullable=True
    )  # Исполнитель заказа
    date_created = Column(DateTime, default=datetime.datetime.utcnow)
    is_urgent = Column(Boolean, default=False)
    total_price = Column(Float)
    items = relationship("Item", back_populates="order", cascade="all, delete-orphan")
    owner = relationship("User", foreign_keys=[user_id], back_populates="orders")
    receiver = relationship(
        "User", foreign_keys=[receiver_id], back_populates="received_orders"
    )
    executor = relationship(
        "User", foreign_keys=[executor_id], back_populates="executed_orders"
    )


class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    name = Column(String, nullable=False)
    works = relationship(
        "ItemWork", back_populates="item", cascade="all, delete-orphan"
    )
    order = relationship("Order", back_populates="items")


class Work(Base):
    __tablename__ = "works"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    standard_price = Column(Float, nullable=False)
    item_works = relationship("ItemWork", back_populates="work")


class ItemWork(Base):
    __tablename__ = "item_works"
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    work_id = Column(Integer, ForeignKey("works.id"), nullable=False)
    price = Column(Float, nullable=False)
    item = relationship("Item", back_populates="works")
    work = relationship("Work", back_populates="item_works")
