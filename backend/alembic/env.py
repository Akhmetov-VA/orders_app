import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# Добавьте путь к директории приложения
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Импорт моделей и DATABASE_URL
from app.database import DATABASE_URL
from app.models import Base

# Получаем конфигурацию Alembic
config = context.config

# Настраиваем логирование
fileConfig(config.config_file_name)

# Устанавливаем метаданные
target_metadata = Base.metadata

# Устанавливаем URL базы данных
config.set_main_option("sqlalchemy.url", DATABASE_URL)

print(f"DATABASE_URL in env.py: {DATABASE_URL}")


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,  # Если необходимо
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
