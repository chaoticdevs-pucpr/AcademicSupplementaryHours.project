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

$coordenador_id = (int)$_SESSION['usuario']['id'];
$stmtCurso = $conexao->prepare("SELECT curso_id FROM COORDENADOR WHERE usuario_id = ?");
$stmtCurso->bind_param("i", $coordenador_id);
$stmtCurso->execute();
$resCurso = $stmtCurso->get_result();
if($resCurso->num_rows == 0){
    $retorno = ['status' => 'nok', 'mensagem' => 'Coordenador sem curso vinculado.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}
$curso = $resCurso->fetch_assoc();
$curso_id = (int)$curso['curso_id'];
$stmtCurso->close();

if(isset($_GET['id'], $_POST['versao'], $_POST['data_manual'], $_POST['pontos_objetivo'])){
    $manual_id = (int)$_GET['id'];
    $versao = $_POST['versao'];
    $data_manual = $_POST['data_manual'];
    $pontos_objetivo = (int)$_POST['pontos_objetivo'];

    $stmt = $conexao->prepare("UPDATE MANUAL_HC SET versao = ?, data = ?, pontos_objetivo = ? WHERE id = ? AND curso_id = ?");
    $stmt->bind_param("ssiii", $versao, $data_manual, $pontos_objetivo, $manual_id, $curso_id);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $retorno = ['status' => 'ok', 'mensagem' => 'Versão alterada com sucesso.', 'data' => []];
    } else {
        $retorno = ['status' => 'nok', 'mensagem' => 'Nao foi possivel alterar.', 'data' => []];
    }
    $stmt->close();
} else {
    $retorno = ['status' => 'nok', 'mensagem' => 'Nao posso alterar sem informar ID.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
