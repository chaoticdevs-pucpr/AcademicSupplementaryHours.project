<?php
include_once('../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'ESTUDANTE'){
    $retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$estudante_id = (int)$_SESSION['usuario']['id'];
$stmtMatricula = $conexao->prepare("SELECT m.id FROM MATRICULA m WHERE m.estudante_id = ? ORDER BY m.id LIMIT 1");
$stmtMatricula->bind_param("i", $estudante_id);
$stmtMatricula->execute();
$resMatricula = $stmtMatricula->get_result();
if($resMatricula->num_rows == 0){
    $retorno = ['status' => 'nok', 'mensagem' => 'Estudante sem matricula ativa.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}
$matricula = $resMatricula->fetch_assoc();
$matricula_id = (int)$matricula['id'];
$stmtMatricula->close();

if(isset($_GET['id'])){
    $stmt = $conexao->prepare("DELETE FROM SOLICITACAO WHERE id = ? AND matricula_id = ? AND status = 'PENDENTE'");
    $stmt->bind_param("ii", $_GET['id'], $matricula_id);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $retorno = ['status' => 'ok', 'mensagem' => 'Registro excluido.', 'data' => []];
    }else{
        $retorno = ['status' => 'nok', 'mensagem' => 'Somente solicitacoes pendentes podem ser excluidas.', 'data' => []];
    }
    $stmt->close();
}else{
    $retorno = ['status' => 'nok', 'mensagem' => 'E necessario informar um ID para exclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
