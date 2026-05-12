DROP DATABASE IF EXISTS Ash_Project;
CREATE DATABASE IF NOT EXISTS Ash_Project;
USE Ash_Project;

CREATE TABLE USUARIO (
  id int PRIMARY KEY AUTO_INCREMENT,
  email varchar(100) UNIQUE,
  senha varchar(255),
  perfil varchar(30), -- 'ESTUDANTE, PROFESSOR, COORDENADOR, ADMIN'
  nome varchar(100),
  cpf varchar(11),
  celular varchar(11),
  telefone varchar(20),
  status varchar(20) DEFAULT 'ATIVO' -- 'ATIVO, INATIVO'
);

CREATE TABLE CURSO (
  id int PRIMARY KEY AUTO_INCREMENT,
  nome varchar(100)
);

CREATE TABLE ADMINISTRADOR (
  usuario_id int PRIMARY KEY,
  FOREIGN KEY (usuario_id) REFERENCES USUARIO (id)
);

CREATE TABLE COORDENADOR (
  usuario_id int PRIMARY KEY,
  curso_id int,
  cadastrado_por_admin_id int,
  FOREIGN KEY (usuario_id) REFERENCES USUARIO (id),
  FOREIGN KEY (curso_id) REFERENCES CURSO (id),
  FOREIGN KEY (cadastrado_por_admin_id) REFERENCES ADMINISTRADOR (usuario_id)
);

CREATE TABLE PROF_VALIDADOR (
  usuario_id int PRIMARY KEY,
  cadastrado_por_coord_id int,
  FOREIGN KEY (usuario_id) REFERENCES USUARIO (id),
  FOREIGN KEY (cadastrado_por_coord_id) REFERENCES COORDENADOR (usuario_id)
);

CREATE TABLE ESTUDANTE (
  usuario_id int PRIMARY KEY,
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
  total_horas decimal(10,2) DEFAULT 0,
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
  data_envios TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

-- Abandonado por Inutilidade
-- CREATE TABLE RELATORIO (
--   id int PRIMARY KEY AUTO_INCREMENT,
--   prof_validador_id int,
--   turma_id int,
--   data date,
--   aprovado_por_coord_id int,
--   status varchar(20) COMMENT 'PENDENTE, APROVADO',
--   FOREIGN KEY (prof_validador_id) REFERENCES PROF_VALIDADOR (usuario_id),
--   FOREIGN KEY (turma_id) REFERENCES TURMA (id),
--   FOREIGN KEY (aprovado_por_coord_id) REFERENCES COORDENADOR (usuario_id)
-- );

-- Admin
INSERT INTO USUARIO (email, senha, perfil, nome, status) VALUES ('admin@ash.com', '1234', 'ADMIN', 'Daniel de Castro Felix', 'ATIVO');
INSERT INTO ADMINISTRADOR (usuario_id) VALUES (1);

-- Estudantes
INSERT INTO USUARIO (email, senha, perfil, nome, cpf, status) VALUES ('estudante1@ash.com', '1234', 'ESTUDANTE', 'Rodrigo José', '12345678900', 'ATIVO');
INSERT INTO ESTUDANTE (usuario_id, cadastrado_por_admin_id) VALUES (2, 1);

-- Validadores
INSERT INTO USUARIO (email, senha, perfil, nome, cpf, status) VALUES ('prof1@ash.com', '1234', 'PROFESSOR', 'Rodrigo Josué', '98765432100', 'ATIVO');
INSERT INTO PROF_VALIDADOR (usuario_id) VALUES (3);
INSERT INTO USUARIO (email, senha, perfil, nome, cpf, status) VALUES ('prof2@ash.com', '1234', 'PROFESSOR', 'Roberto Josué', '18765432100', 'ATIVO');
INSERT INTO PROF_VALIDADOR (usuario_id) VALUES (4);
INSERT INTO USUARIO (email, senha, perfil, nome, cpf, status) VALUES ('prof3@ash.com', '1234', 'PROFESSOR', 'Adolfo Josué', '28765432100', 'ATIVO');
INSERT INTO PROF_VALIDADOR (usuario_id) VALUES (5);

INSERT INTO USUARIO (email, senha, perfil, nome, cpf, status) VALUES ('prof4@ash.com', '1234', 'PROFESSOR', 'Rodrigo Rodolfo', '08765432100', 'ATIVO');
INSERT INTO PROF_VALIDADOR (usuario_id) VALUES (6);
INSERT INTO USUARIO (email, senha, perfil, nome, cpf, status) VALUES ('prof5@ash.com', '1234', 'PROFESSOR', 'Roberto Rodolfo', '48765432100', 'ATIVO');
INSERT INTO PROF_VALIDADOR (usuario_id) VALUES (7);
INSERT INTO USUARIO (email, senha, perfil, nome, cpf, status) VALUES ('prof6@ash.com', '1234', 'PROFESSOR', 'Adolfo Rodolfo', '38765432100', 'ATIVO');
INSERT INTO PROF_VALIDADOR (usuario_id) VALUES (8);

INSERT INTO CURSO (nome) VALUES ('Engenharia de Software');
INSERT INTO CURSO (nome) VALUES ('Engenharia da Computação');

INSERT INTO TURMA (curso_id, prof_validador_id, nome) VALUES (1, 3, 'A-M');
INSERT INTO TURMA (curso_id, prof_validador_id, nome) VALUES (1, 4, 'B-M');
INSERT INTO TURMA (curso_id, prof_validador_id, nome) VALUES (1, 5, 'U-N');

INSERT INTO TURMA (curso_id, prof_validador_id, nome) VALUES (2, 6, 'A-M');
INSERT INTO TURMA (curso_id, prof_validador_id, nome) VALUES (2, 7, 'B-M');
INSERT INTO TURMA (curso_id, prof_validador_id, nome) VALUES (2, 6, 'U-N');

INSERT INTO MATRICULA (estudante_id, turma_id, total_horas) VALUES (2, 1, 0);


INSERT INTO MANUAL_HC (id, curso_id, horas_objetivo, versao, data) 
VALUES (1, 1, 100, 'v1.0', CURDATE());
INSERT INTO CATEGORIA (id, manual_hc_id, max_horas, nome) VALUES 
(1, 1, 30, 'Atividades Profissionais'),
(2, 1, 30, 'Atividades de Ação Social');
INSERT INTO SUBCATEGORIA (categoria_id, quant_horas, nome) VALUES 
(1, 10, 'Realização de Estágios'),
(1, 10, 'Realização de Atividades de Aceleração/Incubação de Startup'),
(1, 10, 'Realização de Atividades Profissionais na Área de Computação'),
(2, 10, 'Participação de Projetos em Caráter Social'),
(2, 5, 'Participação na Clínica de TIC'),
(2, 5, 'Participação como Mesário em Eleições Municipais, Estaduais e Federais');

INSERT INTO MANUAL_HC (id, curso_id, horas_objetivo, versao, data) 
VALUES (2, 2, 100, 'v1.0', CURDATE());
INSERT INTO CATEGORIA (id, manual_hc_id, max_horas, nome) VALUES 
(3, 2, 30, 'Atividades Profissionais'),
(4, 2, 30, 'Atividades de Ação Social');
INSERT INTO SUBCATEGORIA (categoria_id, quant_horas, nome) VALUES 
(3, 10, 'Realização de Estágios'),
(3, 10, 'Realização de Atividades de Aceleração/Incubação de Startup'),
(3, 10, 'Realização de Atividades Profissionais na Área de Computação'),
(4, 10, 'Participação de Projetos em Caráter Social'),
(4, 5, 'Participação na Clínica de TIC'),
(4, 5, 'Participação como Mesário em Eleições Municipais, Estaduais e Federais');