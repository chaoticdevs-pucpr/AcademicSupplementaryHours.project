<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'ADMIN'){
    $retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

if(isset($_GET['id'])){
    $stmt = $conexao->prepare("SELECT u.id, u.email, e.nome, e.cpf, e.celular, e.telefone, m.id AS matricula_id, t.id AS turma_id, t.nome AS turma_nome, c.id AS curso_id, c.nome AS curso_nome FROM USUARIO u INNER JOIN ESTUDANTE e ON e.usuario_id = u.id LEFT JOIN MATRICULA m ON m.estudante_id = e.usuario_id LEFT JOIN TURMA t ON t.id = m.turma_id LEFT JOIN CURSO c ON c.id = t.curso_id WHERE u.perfil = 'ESTUDANTE' AND u.id = ?");
    $stmt->bind_param("i", $_GET['id']);
}else{
    $stmt = $conexao->prepare("SELECT u.id, u.email, e.nome, e.cpf, e.celular, e.telefone, m.id AS matricula_id, t.id AS turma_id, t.nome AS turma_nome, c.id AS curso_id, c.nome AS curso_nome FROM USUARIO u INNER JOIN ESTUDANTE e ON e.usuario_id = u.id LEFT JOIN MATRICULA m ON m.estudante_id = e.usuario_id LEFT JOIN TURMA t ON t.id = m.turma_id LEFT JOIN CURSO c ON c.id = t.curso_id WHERE u.perfil = 'ESTUDANTE' ORDER BY e.nome");
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
