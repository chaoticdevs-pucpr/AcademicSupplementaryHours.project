DROP DATABASE IF EXISTS Ash_Project;
CREATE DATABASE IF NOT EXISTS Ash_Project;
USE Ash_Project;

CREATE TABLE USUARIO (
  id int PRIMARY KEY AUTO_INCREMENT,
  email varchar(100) UNIQUE,
  senha varchar(255),
  perfil varchar(30) COMMENT 'ESTUDANTE, PROFESSOR, COORDENADOR, ADMIN'
);

CREATE TABLE CURSO (
  id int PRIMARY KEY AUTO_INCREMENT,
  nome varchar(100)
);

CREATE TABLE ADMINISTRADOR (
  usuario_id int PRIMARY KEY,
  nome varchar(100),
  FOREIGN KEY (usuario_id) REFERENCES USUARIO (id)
);

CREATE TABLE COORDENADOR (
  usuario_id int PRIMARY KEY,
  curso_id int,
  nome varchar(100),
  cpf varchar(11),
  celular varchar(11),
  telefone varchar(20),
  cadastrado_por_admin_id int,
  FOREIGN KEY (usuario_id) REFERENCES USUARIO (id),
  FOREIGN KEY (curso_id) REFERENCES CURSO (id),
  FOREIGN KEY (cadastrado_por_admin_id) REFERENCES ADMINISTRADOR (usuario_id)
);

CREATE TABLE PROF_VALIDADOR (
  usuario_id int PRIMARY KEY,
  nome varchar(100),
  cpf varchar(11),
  celular varchar(11),
  telefone varchar(20),
  cadastrado_por_coord_id int,
  FOREIGN KEY (usuario_id) REFERENCES USUARIO (id),
  FOREIGN KEY (cadastrado_por_coord_id) REFERENCES COORDENADOR (usuario_id)
);

CREATE TABLE ESTUDANTE (
  usuario_id int PRIMARY KEY,
  nome varchar(100),
  cpf varchar(11),
  celular varchar(11),
  telefone varchar(20),
  cadastrado_por_admin_id int,
  FOREIGN KEY (usuario_id) REFERENCES USUARIO (id),
  FOREIGN KEY (cadastrado_por_admin_id) REFERENCES ADMINISTRADOR (usuario_id)
);

CREATE TABLE TURMA (
  id int PRIMARY KEY AUTO_INCREMENT,
  curso_id int,
  prof_validador_id int,
  nome varchar(50),
  FOREIGN KEY (curso_id) REFERENCES CURSO (id),
  FOREIGN KEY (prof_validador_id) REFERENCES PROF_VALIDADOR (usuario_id)
);

CREATE TABLE MATRICULA (
  id int PRIMARY KEY AUTO_INCREMENT,
  estudante_id int,
  turma_id int,
  FOREIGN KEY (estudante_id) REFERENCES ESTUDANTE (usuario_id),
  FOREIGN KEY (turma_id) REFERENCES TURMA (id)
);

CREATE TABLE MANUAL_HC (
  id int PRIMARY KEY AUTO_INCREMENT,
  curso_id int,
  horas_objetivo int,
  versao varchar(20),
  data date,
  FOREIGN KEY (curso_id) REFERENCES CURSO (id)
);

CREATE TABLE CATEGORIA (
  id int PRIMARY KEY AUTO_INCREMENT,
  manual_hc_id int,
  max_horas int,
  nome varchar(100),
  FOREIGN KEY (manual_hc_id) REFERENCES MANUAL_HC (id)
);

CREATE TABLE SUBCATEGORIA (
  id int PRIMARY KEY AUTO_INCREMENT,
  categoria_id int,
  quant_horas int,
  nome varchar(100),
  FOREIGN KEY (categoria_id) REFERENCES CATEGORIA (id)
);

CREATE TABLE SOLICITACAO (
  id int PRIMARY KEY AUTO_INCREMENT,
  matricula_id int,
  subcategoria_id int,
  prof_validador_id int,
  data_envio date,
  horas_brutas decimal,
  horas_validadas decimal,
  status varchar(20) COMMENT 'PENDENTE, APROVADO, RECUSADO',
  justificativa text,
  FOREIGN KEY (matricula_id) REFERENCES MATRICULA (id),
  FOREIGN KEY (subcategoria_id) REFERENCES SUBCATEGORIA (id),
  FOREIGN KEY (prof_validador_id) REFERENCES PROF_VALIDADOR (usuario_id)
);

CREATE TABLE ANEXO (
  id int PRIMARY KEY AUTO_INCREMENT,
  solicitacao_id int,
  caminho_arquivo varchar(255),
  FOREIGN KEY (solicitacao_id) REFERENCES SOLICITACAO (id)
);

CREATE TABLE RELATORIO (
  id int PRIMARY KEY AUTO_INCREMENT,
  prof_validador_id int,
  turma_id int,
  data date,
  aprovado_por_coord_id int,
  status varchar(20) COMMENT 'PENDENTE, APROVADO',
  FOREIGN KEY (prof_validador_id) REFERENCES PROF_VALIDADOR (usuario_id),
  FOREIGN KEY (turma_id) REFERENCES TURMA (id),
  FOREIGN KEY (aprovado_por_coord_id) REFERENCES COORDENADOR (usuario_id)
);

INSERT INTO USUARIO (email, senha, perfil) VALUES ('admin@ash.com', '1234', 'ADMIN');
INSERT INTO ADMINISTRADOR (usuario_id, nome) VALUES (1, 'Daniel de Castro Felix');

INSERT INTO CURSO (id, nome) VALUES ('1', 'Engenharia de Software');
INSERT INTO CURSO (id, nome) VALUES ('2', 'Engenharia da Computação');
INSERT INTO CURSO (nome) VALUES ('Medicina');
SELECT * FROM CURSO WHERE ID = 3;
