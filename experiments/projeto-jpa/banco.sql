CREATE DATABASE IF NOT EXISTS ash_jpa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ash_jpa;

CREATE TABLE IF NOT EXISTS curso (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS administrador (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(50),
    email VARCHAR(255),
    senha VARCHAR(255),
    status VARCHAR(50),
    curso_id BIGINT UNIQUE,
    CONSTRAINT fk_administrador_curso
        FOREIGN KEY (curso_id) REFERENCES curso(id)
);

CREATE TABLE IF NOT EXISTS turma (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    curso_id BIGINT,
    administrador_id BIGINT UNIQUE,
    CONSTRAINT fk_turma_curso
        FOREIGN KEY (curso_id) REFERENCES curso(id),
    CONSTRAINT fk_turma_administrador
        FOREIGN KEY (administrador_id) REFERENCES administrador(id)
);
