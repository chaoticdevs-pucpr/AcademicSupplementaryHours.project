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
  total_pontos decimal(10,2) DEFAULT 0,
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
  max_pontos int,
  nome varchar(100),
  descricao text,
  FOREIGN KEY (manual_hc_id) REFERENCES MANUAL_HC (id)
);

CREATE TABLE SUBCATEGORIA (
  id int PRIMARY KEY AUTO_INCREMENT,
  categoria_id int,
  quant_pontos int,
  nome varchar(100),
  descricao text,
  tipo_calculo varchar(20) DEFAULT 'FIXO' COMMENT 'FIXO, HORA, PERIODO, EVENTO, ANO, SEMESTRE',
  unidade_referencia varchar(20) DEFAULT 'PONTO', -- Sinceramente ele até poderia ser removido, mas apenas facilita a leitura (por si só o tipo_calculo já resolve, mas talvez ajude a quem lê o código de fora a entender)
  valor_referencia decimal(10,2) DEFAULT 1, -- É apenas um coeficiente para ajudar em alguns cálculos como: 5 pontos a cada 4 horas (nisso o valor_referencia seria = 4 :)
  FOREIGN KEY (categoria_id) REFERENCES CATEGORIA (id)
);

CREATE TABLE SOLICITACAO (
  id int PRIMARY KEY AUTO_INCREMENT,
  matricula_id int,
  turma_id int,
  subcategoria_id int,
  prof_validador_id int,
  data_envios TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  horas_brutas decimal,
  pontos_validados decimal,
  status varchar(20) COMMENT 'PENDENTE, APROVADO, RECUSADO',
  justificativa text,
  FOREIGN KEY (matricula_id) REFERENCES MATRICULA (id),
  FOREIGN KEY (subcategoria_id) REFERENCES SUBCATEGORIA (id),
  FOREIGN KEY (turma_id) REFERENCES TURMA (id),
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

INSERT INTO MATRICULA (estudante_id, turma_id, total_pontos) VALUES (2, 1, 0);


INSERT INTO MANUAL_HC (id, curso_id, horas_objetivo, versao, data) 
VALUES (1, 1, 50, 'v1.0', CURDATE());

-- Categorias e Subcategorias do Manual (Curso: Engenharia de Software)
INSERT INTO CATEGORIA (id, manual_hc_id, max_pontos, nome) VALUES
(1, 1, 30, 'Atividades Profissionais'),
(2, 1, 20, 'Pesquisa Científica'),
(3, 1, 10, 'Atividades Culturais'),
(4, 1, 10, 'Atividades Esportivas'),
(5, 1, 30, 'Atividades Acadêmicas'),
(6, 1, 10, 'Atividades de Ação Social'),
(7, 1, 20, 'Atividades de Internacionalização');

INSERT INTO SUBCATEGORIA (categoria_id, quant_pontos, nome, descricao, tipo_calculo, unidade_referencia, valor_referencia) VALUES
-- Atividades Profissionais
(1, 10, 'Realização de Estágios', 'A cada 6 meses de estágio com no mínimo 20 horas semanais: 10 pontos.', 'PERIODO', 'MES', 6),
(1, 10, 'Atividades de Aceleração/Incubação de Startup', 'A cada 6 meses de atividades de aceleração/incubação com no mínimo 20 horas semanais: 10 pontos.', 'PERIODO', 'MES', 6),
(1, 10, 'Atividade Profissional remunerada (>=20h/sem)', 'A cada 6 meses com mínimo 20 horas semanais: 10 pontos.', 'PERIODO', 'MES', 6),
(1, 20, 'Atividade Profissional remunerada (>=40h/sem)', 'A cada 6 meses com mínimo 40 horas semanais: 20 pontos.', 'PERIODO', 'MES', 6),

-- Pesquisa Científica
(2, 15, 'Bolsista em Programa de Pesquisa (PIBIC/ICV)', 'Projeto concluído e apresentado no SEMIC: 15 pontos.', 'FIXO', 'PONTO', 15),
(2, 5, 'Participação em Projetos de Pesquisa (colaborador)', 'Participação mínima de 6 meses e relatório aprovado: 5 pontos.', 'PERIODO', 'MES', 6),
(2, 2, 'Participação em Evento Científico como Ouvinte', 'Evento com mínimo 16 horas e 75% de frequência: 2 pontos.', 'HORA', 'HORA', 16),
(2, 5, 'Organização de Eventos Acadêmicos/Científicos', 'Aprovado pela Coordenação do Curso: 5 pontos.', 'FIXO', 'PONTO', 5),
(2, 5, 'Apresentação de Trabalho em Evento Científico (Pôster/Resumo)', 'Apresentação em evento (exceto SEMIC): 5 pontos.', 'FIXO', 'PONTO', 5),

-- Subcategoria removida pela exigência da criação de uma outra tabela. De certa forma é necessária, mas apenas pela aplicação do projeto será ignorada.
-- Soluções: Criar uma tabela nova no banco ou sempre renovar o código .php quando o manual for atualizado.
-- (2, 0, 'Publicação de Artigo Científico Completo', 'Pontuação conforme tabela Qualis (A1,A2,B1...): ver tabela no manual.', 'QUALIS', 'QUALIS', 0),

-- Atividades Culturais
(3, 10, 'Instrumentista na Orquestra Experimental', 'Durante 1 ano: 10 pontos.', 'ANO', 'ANO', 1),
(3, 10, 'Ator no Grupo de Teatro', 'Durante 1 ano: 10 pontos.', 'ANO', 'ANO', 1),
(3, 10, 'Vocal no Coral', 'Durante 1 ano: 10 pontos.', 'ANO', 'ANO', 1),
(3, 5, 'Finalista do Revele Seu Talento', 'Finalista em competição: 5 pontos.', 'FIXO', 'PONTO', 5),
(3, 5, 'Criação/Manutenção de Home Page/Blog/Jornal', '5 pontos para cada 4 horas de participação.', 'HORA', 'HORA', 4),

-- Atividades Esportivas
(4, 10, 'Atleta PUCPR - JUPS', 'Representando a instituição nos JUPS: 10 pontos.', 'FIXO', 'PONTO', 10),
(4, 10, 'Atleta PUCPR - JUBS', 'Representando a instituição nos JUBS: 10 pontos.', 'FIXO', 'PONTO', 10),
(4, 10, 'Atleta em Jogos Internos - JIP', 'Participação em jogos internos da PUCPR: 10 pontos.', 'FIXO', 'PONTO', 10),
(4, 5, 'Finalista em Modalidades Esportivas', 'Finalista em uma das modalidades: 5 pontos adicionais.', 'FIXO', 'PONTO', 5),

-- Atividades Acadêmicas
(5, 3, 'Participação em Semana Acadêmica da Computação', '3 pontos para cada ano de participação (mínimo 75% de frequência).', 'ANO', 'ANO', 1),
(5, 2, 'Participação no Stand do Curso (Planeta PUCPR)', '2 pontos para cada turno de 8 horas de participação.', 'HORA', 'HORA', 8),
(5, 1, 'Participação em Evento Acadêmico (ex.: Hackathons)', 'Evento com mínimo 8 horas e 75% de frequência: 1 ponto.', 'HORA', 'HORA', 8),
(5, 5, 'Curso de Extensão (PUCPR ou outra instituição)', '5 pontos a cada 20 horas de curso.', 'HORA', 'HORA', 20),
(5, 2, 'Apresentação de Palestra', 'Palestra não prevista em estágio: 2 pontos.', 'FIXO', 'PONTO', 2),
(5, 1, 'Monitor em Projeto de Monitoria', '1 ponto para cada 1 hora semanal por semestre acadêmico (documentado).', 'SEMESTRE', 'SEMESTRE', 1),
(5, 2, 'Participação em Diretórios e Centros Acadêmicos', '2 pontos por semestre acadêmico de participação.', 'SEMESTRE', 'SEMESTRE', 1),
(5, 1, 'Organização/Promoção da Semana Acadêmica', '1 ponto por ano de participação (não sendo membro do Centro Acadêmico).', 'ANO', 'ANO', 1),
(5, 1, 'Representante de Turma', '1 ponto por semestre acadêmico participante.', 'SEMESTRE', 'SEMESTRE', 1),

-- Atividades de Ação Social
(6, 10, 'Projetos de Caráter Social', '10 pontos por projeto concluído.', 'FIXO', 'PONTO', 10),
(6, 5, 'Clínica de TIC', '5 pontos a cada 30 horas.', 'HORA', 'HORA', 30),
(6, 5, 'Mesário em Eleições', '5 pontos por ano de participação.', 'ANO', 'ANO', 1),

-- Internacionalização
(7, 15, 'Programa de Intercâmbio de Graduação', '15 pontos a cada semestre letivo com aproveitamento de 75% dos créditos.', 'SEMESTRE', 'SEMESTRE', 1),
(7, 5, 'Intercâmbio de Curso de Idiomas', '5 pontos a cada 30 horas efetivas de curso no exterior.', 'HORA', 'HORA', 30),
(7, 5, 'Curso de Extensão Internacional (MOOC)', '5 pontos a cada 20 horas de curso.', 'HORA', 'HORA', 20),
(7, 5, 'Disciplina do English Semester', '5 pontos por disciplina aprovada no English Semester.', 'FIXO', 'PONTO', 5);