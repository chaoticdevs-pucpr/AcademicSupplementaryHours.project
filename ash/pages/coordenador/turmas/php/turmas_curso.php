<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'curso_nome' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'COORDENADOR'){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Sem permissao.',
        'curso_nome' => '',
        'data' => []
    ];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$stmtCurso = $conexao->prepare("SELECT c.id, c.nome FROM COORDENADOR co INNER JOIN CURSO c ON c.id = co.curso_id WHERE co.usuario_id = ?");
$stmtCurso->bind_param("i", $_SESSION['usuario']['id']);
$stmtCurso->execute();
$resCurso = $stmtCurso->get_result();

if($resCurso->num_rows == 0){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Coordenador sem curso vinculado.',
        'curso_nome' => '',
        'data' => []
    ];
    $stmtCurso->close();
    $conexao->close();
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$curso = $resCurso->fetch_assoc();
$curso_id = (int)$curso['id'];
$curso_nome = $curso['nome'];
$stmtCurso->close();

$stmt = $conexao->prepare("SELECT t.id, t.nome FROM TURMA t WHERE t.curso_id = ? ORDER BY t.nome");
$stmt->bind_param("i", $curso_id);
$stmt->execute();
$resultado = $stmt->get_result();
$tabela = [];
while($linha = $resultado->fetch_assoc()){
    $tabela[] = $linha;
}

$retorno = [
    'status' => 'ok',
    'mensagem' => 'Consulta efetuada.',
    'curso_nome' => $curso_nome,
    'data' => $tabela
];

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);