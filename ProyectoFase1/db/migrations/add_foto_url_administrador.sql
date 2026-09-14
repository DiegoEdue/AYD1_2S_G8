-- Migración: agregar columna foto_url a la tabla administrador
-- Ejecutar este script en la base de datos existente una sola vez.

ALTER TABLE administrador
  ADD COLUMN IF NOT EXISTS foto_url VARCHAR(500);
