<?php
include_once('../../../z_php/conexao.php');
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

if(isset($_GET['id'])){
    $stmt = $conexao->prepare("SELECT u.id, u.email, c.nome, c.cpf, c.celular, c.telefone, c.curso_id FROM USUARIO u INNER JOIN COORDENADOR c ON c.usuario_id = u.id WHERE u.perfil = 'COORDENADOR' AND u.id = ?");
    $stmt->bind_param("i", $_GET['id']);
}else{
    $stmt = $conexao->prepare("SELECT u.id, u.email, c.nome, c.cpf, c.celular, c.telefone, c.curso_id, cu.nome AS curso_nome FROM USUARIO u INNER JOIN COORDENADOR c ON c.usuario_id = u.id INNER JOIN CURSO cu ON cu.id = c.curso_id WHERE u.perfil = 'COORDENADOR' ORDER BY c.nome");
}

$stmt->execute();
$resultado = $stmt->get_result();
$tabela = [];
if($resultado->num_rows > 0){
    while($linha = $resultado->fetch_assoc()){
        $tabela[] = $linha;
    }

    $retorno = [
        'status' => 'ok',
        'mensagem' => 'Consulta efetuada.',
        'data' => $tabela
    ];
}else{
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Nao ha registros.',
        'data' => []
    ];
}

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
