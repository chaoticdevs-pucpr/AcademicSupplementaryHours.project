<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'COORDENADOR'){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Sem permissao.',
        'data' => []
    ];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

if(!isset($_GET['turma_id']) || (int)$_GET['turma_id'] <= 0){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Turma invalida.',
        'data' => []
    ];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$turma_id = (int)$_GET['turma_id'];

$stmtCurso = $conexao->prepare("SELECT co.curso_id, c.nome AS curso_nome FROM COORDENADOR co INNER JOIN CURSO c ON c.id = co.curso_id WHERE co.usuario_id = ?");
$stmtCurso->bind_param("i", $_SESSION['usuario']['id']);
$stmtCurso->execute();
$resCurso = $stmtCurso->get_result();

if($resCurso->num_rows == 0){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Coordenador sem curso vinculado.',
        'data' => []
    ];
    $stmtCurso->close();
    $conexao->close();
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$curso = $resCurso->fetch_assoc();
$curso_id = (int)$curso['curso_id'];
$curso_nome = $curso['curso_nome'];
$stmtCurso->close();

$stmtTurma = $conexao->prepare("SELECT t.id, t.nome FROM TURMA t WHERE t.id = ? AND t.curso_id = ?");
$stmtTurma->bind_param("ii", $turma_id, $curso_id);
$stmtTurma->execute();
$resTurma = $stmtTurma->get_result();

if($resTurma->num_rows == 0){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Turma nao pertence ao curso deste coordenador.',
        'data' => []
    ];
    $stmtTurma->close();
    $conexao->close();
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$turma = $resTurma->fetch_assoc();
$turma_nome = $turma['nome'];
$stmtTurma->close();

$stmt = $conexao->prepare("SELECT u.id, u.email, e.nome, e.cpf, e.celular, e.telefone, m.id AS matricula_id, t.nome AS turma_nome, c.nome AS curso_nome FROM MATRICULA m INNER JOIN ESTUDANTE e ON e.usuario_id = m.estudante_id INNER JOIN USUARIO u ON u.id = e.usuario_id INNER JOIN TURMA t ON t.id = m.turma_id INNER JOIN CURSO c ON c.id = t.curso_id WHERE m.turma_id = ? AND t.curso_id = ? ORDER BY e.nome");
$stmt->bind_param("ii", $turma_id, $curso_id);
$stmt->execute();
$resultado = $stmt->get_result();
$tabela = [];
while($linha = $resultado->fetch_assoc()){
    $tabela[] = $linha;
}

$retorno = [
    'status' => 'ok',
    'mensagem' => 'Consulta efetuada.',
    'turma_nome' => $turma_nome,
    'curso_nome' => $curso_nome,
    'data' => $tabela
];

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);