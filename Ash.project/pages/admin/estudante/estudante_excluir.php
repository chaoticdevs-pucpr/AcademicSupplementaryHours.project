<?php
include_once('../../../z_php/conexao.php');
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
    $stmt = $conexao->prepare("DELETE FROM MATRICULA WHERE estudante_id = ?");
    $stmt->bind_param("i", $_GET['id']);
    $stmt->execute();
    $stmt->close();

    $stmt = $conexao->prepare("DELETE FROM ESTUDANTE WHERE usuario_id = ?");
    $stmt->bind_param("i", $_GET['id']);
    $stmt->execute();
    $stmt->close();

    $stmt = $conexao->prepare("DELETE FROM USUARIO WHERE id = ? AND perfil = 'ESTUDANTE'");
    $stmt->bind_param("i", $_GET['id']);
    $stmt->execute();
    if($stmt->affected_rows > 0){
        $retorno = ['status' => 'ok', 'mensagem' => 'Registro excluido.', 'data' => []];
    }else{
        $retorno = ['status' => 'nok', 'mensagem' => 'Registro nao excluido.', 'data' => []];
    }
    $stmt->close();
}else{
    $retorno = ['status' => 'nok', 'mensagem' => 'E necessario informar um ID para exclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
