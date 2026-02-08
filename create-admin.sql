-- Script para crear el usuario administrador principal
-- Ejecutar con: wrangler d1 execute medical-orders-db --remote --file=./create-admin.sql

INSERT INTO users (id, email, password, name, role, created_at)
VALUES (
  'admin-' || hex(randomblob(8)),
  'loradavid000@gmail.com',
  -- Hash de la contraseña '3008david' (generado con bcrypt, costo 10)
  -- IMPORTANTE: Cambiar esta contraseña después del primer login
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGN5aEhN8gxOjPdZke',
  'David Lora - Admin Principal',
  'admin',
  datetime('now')
);

-- Verificar que se creó correctamente
SELECT id, email, name, role, created_at FROM users WHERE email = 'loradavid000@gmail.com';
