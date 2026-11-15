CREATE DATABASE IF NOT EXISTS ash_jpa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ash_jpa;

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(50),
    email VARCHAR(255),
    senha VARCHAR(255),
    celular VARCHAR(50),
    telefone VARCHAR(50),
    status VARCHAR(50)
);

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

CREATE TABLE IF NOT EXISTS estudante (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(50),
    email VARCHAR(255),
    senha VARCHAR(255),
    celular VARCHAR(50),
    telefone VARCHAR(50),
    status VARCHAR(50),
    administrador_id BIGINT,
    CONSTRAINT fk_estudante_administrador
        FOREIGN KEY (administrador_id) REFERENCES administrador(id)
);

CREATE TABLE IF NOT EXISTS coordenador (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(50),
    email VARCHAR(255),
    senha VARCHAR(255),
    celular VARCHAR(50),
    telefone VARCHAR(50),
    status VARCHAR(50),
    curso_id BIGINT,
    administrador_id BIGINT,
    CONSTRAINT fk_coordenador_curso
        FOREIGN KEY (curso_id) REFERENCES curso(id),
    CONSTRAINT fk_coordenador_administrador
        FOREIGN KEY (administrador_id) REFERENCES administrador(id)
);

CREATE TABLE IF NOT EXISTS professor_validador (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(50),
    email VARCHAR(255),
    senha VARCHAR(255),
    celular VARCHAR(50),
    telefone VARCHAR(50),
    status VARCHAR(50),
    matriculaInstitucional VARCHAR(255),
    cndb VARCHAR(255),
    coordenador_id BIGINT,
    CONSTRAINT fk_professor_coordenador
        FOREIGN KEY (coordenador_id) REFERENCES coordenador(id)
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

CREATE TABLE IF NOT EXISTS atividade (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data DATETIME,
    horasBrutas DOUBLE,
    horasValidadas DOUBLE,
    status VARCHAR(50),
    justificativa VARCHAR(255),
    categoria VARCHAR(255),
    arquivoAnexo VARCHAR(255),
    professor_validador_id BIGINT,
    turma_id BIGINT,
    estudante_id BIGINT,
    CONSTRAINT fk_atividade_professor
        FOREIGN KEY (professor_validador_id) REFERENCES professor_validador(id),
    CONSTRAINT fk_atividade_turma
        FOREIGN KEY (turma_id) REFERENCES turma(id),
    CONSTRAINT fk_atividade_estudante
        FOREIGN KEY (estudante_id) REFERENCES estudante(id)
);
