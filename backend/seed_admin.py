"""
Script de seed — crea el usuario admin inicial.
Uso: py seed_admin.py
"""
from passlib.context import CryptContext
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os
import uuid

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

email = "pruebas@cafequindio.com"
password = "cq123"
name = "Admin CQ"
role = "admin"

password_hash = pwd_context.hash(password)

with engine.connect() as conn:
    existing = conn.execute(
        text("SELECT id FROM users WHERE email = :email"),
        {"email": email}
    ).fetchone()

    if existing:
        print(f"[WARN] El usuario {email} ya existe.")
    else:
        conn.execute(
            text("""
                INSERT INTO users (id, name, email, role, status, password_hash)
                VALUES (:id, :name, :email, :role, 'activo', :password_hash)
            """),
            {
                "id": str(uuid.uuid4()),
                "name": name,
                "email": email,
                "role": role,
                "password_hash": password_hash,
            }
        )
        conn.commit()
        print(f"[OK] Usuario admin creado correctamente.")
        print(f"     Email:      {email}")
        print(f"     Contrasena: {password}")
        print(f"     Rol:        {role}")
