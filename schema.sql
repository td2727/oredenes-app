-- Medical Orders App - Database Schema
-- Base de datos para el Administrador de Órdenes Médicas

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'user')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes médicas
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    order_type TEXT NOT NULL CHECK(order_type IN ('Tomografía', 'Radiografía', 'Ortodoncia', 'Cefalometría')),
    status TEXT NOT NULL CHECK(status IN ('Pendiente', 'En Proceso', 'Completada')),
    description TEXT,
    priority TEXT NOT NULL CHECK(priority IN ('Alta', 'Media', 'Baja')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Crear usuario administrador inicial
-- Email: loradavid000@gmail.com
-- Password: 3008david
-- Password hash es bcrypt de '3008david'
INSERT OR IGNORE INTO users (id, email, password_hash, name, role) 
VALUES (
    'admin-main',
    'loradavid000@gmail.com',
    '$2a$10$rX8vqJ5B2xH3mK9nL4wYVOyGz1cP8sQ7tR5vN6mW4xZ2aC0dE1fGu',
    'David Lora',
    'admin'
);
