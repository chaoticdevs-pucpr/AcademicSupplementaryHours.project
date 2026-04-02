CREATE TABLE curso (
    id INT PRIMARY KEY,
    nome CHAR(50)
);

CREATE TABLE prof_validador (
    id INT PRIMARY KEY,
    endereco CHAR(100),
    email CHAR(50),
    cpf VARCHAR(11),
    celular VARCHAR(11),
    telefone VARCHAR(11),
    nome CHAR(50)
);

CREATE TABLE administrador (
    id INT PRIMARY KEY,
    endereco CHAR(100),
    email CHAR(50),
    cpf VARCHAR(11),
    celular VARCHAR(11),
    telefone VARCHAR(11),
    nome CHAR(50)
);

CREATE TABLE coordenador (
    id INT PRIMARY KEY,
    curso_id INT,
    endereco CHAR(100),
    email CHAR(50),
    cpf VARCHAR(11),
    nome CHAR(50),
    celular VARCHAR(11),
    telefone VARCHAR(11),
    FOREIGN KEY (curso_id) REFERENCES curso(id)
);

CREATE TABLE turma (
    id INT PRIMARY KEY,
    prof_validador_id INT,
    curso_id INT,
    nome CHAR(50),
    FOREIGN KEY (prof_validador_id) REFERENCES prof_validador(id),
    FOREIGN KEY (curso_id) REFERENCES curso(id)
);

CREATE TABLE manual_hc (
    id INT PRIMARY KEY,
    curso_id INT,
    horas_objetivo INT,
    versao CHAR(10),
    data DATE,
    FOREIGN KEY (curso_id) REFERENCES curso(id)
);

CREATE TABLE estudante (
    id INT PRIMARY KEY,
    curso_id INT,
    turma_id INT,
    endereco CHAR(100),
    email CHAR(50),
    cpf VARCHAR(11),
    nome CHAR(50),
    total_horas INT,
    celular VARCHAR(11),
    telefone VARCHAR(11),
    FOREIGN KEY (curso_id) REFERENCES curso(id),
    FOREIGN KEY (turma_id) REFERENCES turma(id)
);

CREATE TABLE matricula (
    id INT PRIMARY KEY,
    turma_id INT,
    estudante INT,
    FOREIGN KEY (turma_id) REFERENCES turma(id),
    FOREIGN KEY (estudante) REFERENCES estudante(id)
);

CREATE TABLE categoria (
    id INT PRIMARY KEY,
    manual_HC_id INT,
    maxHoras INT,
    nome CHAR(50),
    FOREIGN KEY (manual_HC_id) REFERENCES manual_hc(id)
);

CREATE TABLE subcategoria (
    id INT PRIMARY KEY,
    categoria_id INT,
    quant_horas INT,
    nome CHAR(50),
    FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE solicitacao (
    id INT PRIMARY KEY,
    curso_id INT,
    estudante_id INT,
    categoria CHAR(30),
    subcategoria CHAR(30),
    data DATE,
    documento VARBINARY(MAX),
    FOREIGN KEY (curso_id) REFERENCES curso(id),
    FOREIGN KEY (estudante_id) REFERENCES estudante(id)
);

CREATE TABLE relatorio (
    id INT PRIMARY KEY,
    prof_validador_id INT,
    turma_id INT,
    data DATE,
    FOREIGN KEY (prof_validador_id) REFERENCES prof_validador(id),
    FOREIGN KEY (turma_id) REFERENCES turma(id)
);