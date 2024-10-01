# backend/app/models.py

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Float
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    is_admin = Column(Boolean, default=False)  # Новое поле
    orders = relationship("Order", back_populates="owner")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date_created = Column(DateTime, default=datetime.datetime.utcnow)
    is_urgent = Column(Boolean, default=False)
    total_price = Column(Float)
    items = relationship("Item", back_populates="order")
    owner = relationship("User", back_populates="orders")

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    name = Column(String)
    works = relationship("ItemWork", back_populates="item")
    order = relationship("Order", back_populates="items")

class WorkType(Base):
    __tablename__ = "work_types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

class WorkCategory(Base):
    __tablename__ = "work_categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

class Work(Base):
    __tablename__ = "works"
    id = Column(Integer, primary_key=True, index=True)
    type_id = Column(Integer, ForeignKey("work_types.id"))
    category_id = Column(Integer, ForeignKey("work_categories.id"))
    description = Column(String)
    standard_price = Column(Float)
    type = relationship("WorkType")
    category = relationship("WorkCategory")
    item_works = relationship("ItemWork", back_populates="work")

class ItemWork(Base):
    __tablename__ = "item_works"
    item_id = Column(Integer, ForeignKey("items.id"), primary_key=True)
    work_id = Column(Integer, ForeignKey("works.id"), primary_key=True)
    price = Column(Float)
    item = relationship("Item", back_populates="works")
    work = relationship("Work", back_populates="item_works")
