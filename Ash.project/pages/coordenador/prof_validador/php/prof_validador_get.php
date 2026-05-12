<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'COORDENADOR'){
    $retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

if(isset($_GET['id'])){
    $stmt = $conexao->prepare("SELECT u.id, u.email, p.nome, p.cpf, p.celular, p.telefone, t.id AS turma_id, t.nome AS turma_nome, c.nome AS curso_nome FROM USUARIO u INNER JOIN PROF_VALIDADOR p ON p.usuario_id = u.id LEFT JOIN TURMA t ON t.id = (SELECT id FROM TURMA WHERE prof_validador_id = p.usuario_id ORDER BY id LIMIT 1) LEFT JOIN CURSO c ON c.id = t.curso_id WHERE u.perfil = 'PROFESSOR' AND u.id = ?");
    $stmt->bind_param("i", $_GET['id']);
}else{
    $stmt = $conexao->prepare("SELECT u.id, u.email, p.nome, p.cpf, p.celular, p.telefone, t.id AS turma_id, t.nome AS turma_nome, c.nome AS curso_nome FROM USUARIO u INNER JOIN PROF_VALIDADOR p ON p.usuario_id = u.id LEFT JOIN TURMA t ON t.id = (SELECT id FROM TURMA WHERE prof_validador_id = p.usuario_id ORDER BY id LIMIT 1) LEFT JOIN CURSO c ON c.id = t.curso_id WHERE u.perfil = 'PROFESSOR' ORDER BY p.nome");
}

$stmt->execute();
$resultado = $stmt->get_result();
$tabela = [];
while($linha = $resultado->fetch_assoc()){
    $tabela[] = $linha;
}

if(count($tabela) > 0){
    $retorno = ['status' => 'ok', 'mensagem' => 'Consulta efetuada.', 'data' => $tabela];
}else{
    $retorno = ['status' => 'nok', 'mensagem' => 'Nao ha registros.', 'data' => []];
}

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
