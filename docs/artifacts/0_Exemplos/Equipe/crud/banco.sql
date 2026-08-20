drop database ash;
create database if not exists ash;
use ash;

CREATE TABLE IF NOT EXISTS projeto(
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    usuario VARCHAR(50),
    senha VARCHAR(255)
);

CREATE TABLE if not exists curso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE if not exists turma (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE if not exists coordenador (
    id INT PRIMARY KEY AUTO_INCREMENT,
    curso_id INT,
    endereco VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    FOREIGN KEY (curso_id) REFERENCES curso(id)
);

CREATE TABLE if not exists telefone_coo (
    coordenador_id INT NOT NULL,
    celular VARCHAR(11),
    residencial VARCHAR(11),
    FOREIGN KEY (coordenador_id) REFERENCES coordenador(id) ON DELETE CASCADE
);

CREATE TABLE if not exists estudante (
    id INT PRIMARY KEY AUTO_INCREMENT,
    curso_id INT,
    turma_id INT,
    endereco VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    total_horas INT DEFAULT 0,
    FOREIGN KEY (curso_id) REFERENCES curso(id),
    FOREIGN KEY (turma_id) REFERENCES turma(id)
);

CREATE TABLE if not exists telefone_estudante (
    estudante_id INT NOT NULL,
    celular VARCHAR(11),
    residencial VARCHAR(11),
    FOREIGN KEY (estudante_id) REFERENCES estudante(id) ON DELETE CASCADE
);

INSERT INTO projeto values (1, 'Administrador', 'adm@ash.com', '1234');

INSERT INTO curso values (1, 'Engenharia de Software');

INSERT INTO turma values (1, 'Turma A');
INSERT INTO turma values (2, 'Turma B');
INSERT INTO turma values (3, 'Turma C');


