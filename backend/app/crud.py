# backend/app/crud.py

from typing import List, Optional

from sqlalchemy.orm import Session

from . import models, schemas


# Функции для пользователей
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_users(db: Session):
    return db.query(models.User).all()


def create_user(
    db: Session, user: schemas.UserCreate, hashed_password: str, is_admin: bool = False
):
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_admin=is_admin,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Функции для заказов
def create_order(db: Session, order: schemas.OrderCreate, user_id: int):
    db_order = models.Order(
        user_id=user_id,
        is_urgent=order.is_urgent,
        receiver_id=order.receiver_id,
        executor_id=order.executor_id,
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    # Добавляем предметы к заказу
    for item_data in order.items:
        create_item(db, item_data, db_order.id)
    # Обновляем общую цену заказа
    total_price = calculate_order_total(db, db_order.id)
    db_order.total_price = total_price
    db.commit()
    db.refresh(db_order)
    return db_order


def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()


def get_orders_by_user(db: Session, user_id: int):
    return db.query(models.Order).filter(models.Order.user_id == user_id).all()


def get_all_orders(db: Session):
    return db.query(models.Order).all()


def update_order(db: Session, order_id: int, order_update: schemas.OrderCreate):
    db_order = get_order(db, order_id)
    if not db_order:
        return None
    db_order.is_urgent = order_update.is_urgent
    db_order.receiver_id = order_update.receiver_id
    db_order.executor_id = order_update.executor_id
    # Удаляем существующие предметы и работы
    db.query(models.ItemWork).filter(
        models.ItemWork.item_id.in_([item.id for item in db_order.items])
    ).delete(synchronize_session=False)
    db.query(models.Item).filter(models.Item.order_id == order_id).delete(
        synchronize_session=False
    )
    db.commit()
    # Добавляем обновлённые предметы
    for item_data in order_update.items:
        create_item(db, item_data, db_order.id)
    # Обновляем общую цену
    total_price = calculate_order_total(db, db_order.id)
    db_order.total_price = total_price
    db.commit()
    db.refresh(db_order)
    return db_order


def delete_order(db: Session, order_id: int):
    db_order = get_order(db, order_id)
    if db_order:
        db.delete(db_order)
        db.commit()
        return db_order
    else:
        return None


# Функции для предметов и работ
def create_item(db: Session, item: schemas.ItemCreate, order_id: int):
    db_item = models.Item(name=item.name, order_id=order_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    # Добавляем работы к предмету
    for item_work_data in item.works:
        create_item_work(db, item_work_data, db_item.id)
    return db_item


def create_item_work(db: Session, item_work_data: schemas.ItemWorkCreate, item_id: int):
    db_item_work = models.ItemWork(
        item_id=item_id, work_id=item_work_data.work_id, price=item_work_data.price
    )
    db.add(db_item_work)
    db.commit()
    db.refresh(db_item_work)
    return db_item_work


def get_item_names(db: Session):
    return [
        item.name for item in db.query(models.Item).distinct(models.Item.name).all()
    ]


def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Item).offset(skip).limit(limit).all()


def get_item(db: Session, item_id: int):
    return db.query(models.Item).filter(models.Item.id == item_id).first()


def create_admin_item(db: Session, item: schemas.ItemCreate):
    db_item = models.Item(name=item.name)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    # Создаём связанные работы
    for work_data in item.works:
        db_work = models.Work(
            description=work_data.description,
            standard_price=work_data.standard_price,
        )
        db.add(db_work)
        db.commit()
        db_item_work = models.ItemWork(
            item_id=db_item.id, work_id=db_work.id, price=work_data.standard_price
        )
        db.add(db_item_work)
        db.commit()
    return db_item


def update_admin_item(db: Session, item_id: int, item_update: schemas.ItemUpdate):
    db_item = get_item(db, item_id)
    if not db_item:
        return None
    db_item.name = item_update.name
    # Удаляем существующие работы
    db.query(models.ItemWork).filter(models.ItemWork.item_id == item_id).delete()
    db.query(models.Work).filter(
        models.Work.id.in_([iw.work_id for iw in db_item.works])
    ).delete()
    db.commit()
    # Добавляем обновлённые работы
    for work_data in item_update.works:
        db_work = models.Work(
            description=work_data.description,
            standard_price=work_data.standard_price,
        )
        db.add(db_work)
        db.commit()
        db_item_work = models.ItemWork(
            item_id=db_item.id, work_id=db_work.id, price=work_data.standard_price
        )
        db.add(db_item_work)
        db.commit()
    db.refresh(db_item)
    return db_item


def delete_admin_item(db: Session, item_id: int):
    db_item = get_item(db, item_id)
    if db_item:
        # Удаляем связанные ItemWork и Work
        db.query(models.ItemWork).filter(models.ItemWork.item_id == item_id).delete()
        db.query(models.Work).filter(models.Work.item_works == None).delete()
        db.delete(db_item)
        db.commit()
        return db_item
    else:
        return None


def get_works(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Work).offset(skip).limit(limit).all()


def calculate_order_total(db: Session, order_id: int):
    total_price = 0.0
    db_order = get_order(db, order_id)
    for item in db_order.items:
        for item_work in item.works:
            total_price += item_work.price
    if db_order.is_urgent:
        total_price *= 1.2
    return total_price
