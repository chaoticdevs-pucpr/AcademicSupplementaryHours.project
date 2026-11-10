-- ========================================================
-- Script para criar o banco de dados no phpMyAdmin / MySQL
-- ========================================================

-- 1. Cria o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS biblioteca CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Seleciona o banco para uso
USE biblioteca;

-- 3. Cria a tabela cliente
-- (O EclipseLink também pode criar automaticamente, mas já deixamos pronto)
CREATE TABLE IF NOT EXISTS cliente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255),
    cpf VARCHAR(50),
    fone VARCHAR(50)
);
