from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

if SQLALCHEMY_DATABASE_URL:
    # 1. Clean the string from quotes (e.g. trailing " or ' from copy-paste)
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.strip('"\' ')
    
    # 2. psycopg2 does not support pgbouncer parameters in connection strings.
    # We strip any query parameters entirely since the pooler works perfectly without them.
    if "?" in SQLALCHEMY_DATABASE_URL:
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.split("?", 1)[0]

if SQLALCHEMY_DATABASE_URL and (SQLALCHEMY_DATABASE_URL.startswith("postgresql") or SQLALCHEMY_DATABASE_URL.startswith("postgres")):
    # SQLAlchemy requires "postgresql://" protocol (older postgres:// is deprecated)
    if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)
        
    # Supabase / PostgreSQL configuration with connection pooling optimization
    engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
else:
    # Fallback to local SQLite for development
    SQLALCHEMY_DATABASE_URL = "sqlite:///./fetal_anemia.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
