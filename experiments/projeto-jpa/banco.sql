CREATE DATABASE IF NOT EXISTS ash_jpa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ash_jpa;

CREATE TABLE IF NOT EXISTS administrador (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(50),
    email VARCHAR(255),
    senha VARCHAR(255),
    status VARCHAR(50)
);
