<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'ADMIN'){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Sem permissao.',
        'data' => []
    ];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$stmt = $conexao->prepare("SELECT t.id, t.nome, c.nome AS curso_nome FROM TURMA t INNER JOIN CURSO c ON c.id = t.curso_id ORDER BY c.nome, t.nome");
$stmt->execute();
$resultado = $stmt->get_result();
$tabela = [];
while($linha = $resultado->fetch_assoc()){
    $tabela[] = $linha;
}

$retorno = [
    'status' => 'ok',
    'mensagem' => 'Consulta efetuada.',
    'data' => $tabela
];

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
