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

if(isset($_GET['id'])){
    $manual_id = (int)$_GET['id'];
    $conexao->begin_transaction();

    $stmt = $conexao->prepare("DELETE s FROM SUBCATEGORIA s INNER JOIN CATEGORIA c ON c.id = s.categoria_id INNER JOIN MANUAL_HC m ON m.id = c.manual_hc_id WHERE m.id = ? AND m.curso_id = ?");
    $stmt->bind_param("ii", $manual_id, $curso_id);
    $stmt->execute();
    $stmt->close();

    $stmt = $conexao->prepare("DELETE c FROM CATEGORIA c INNER JOIN MANUAL_HC m ON m.id = c.manual_hc_id WHERE m.id = ? AND m.curso_id = ?");
    $stmt->bind_param("ii", $manual_id, $curso_id);
    $stmt->execute();
    $stmt->close();

    $stmt = $conexao->prepare("DELETE FROM MANUAL_HC WHERE id = ? AND curso_id = ?");
    $stmt->bind_param("ii", $manual_id, $curso_id);
    $stmt->execute();
    $affected = $stmt->affected_rows;
    $stmt->close();

    if($affected > 0){
        $conexao->commit();
        $retorno = ['status' => 'ok', 'mensagem' => 'Versão excluída com sucesso.', 'data' => []];
    } else {
        $conexao->rollback();
        $retorno = ['status' => 'nok', 'mensagem' => 'Nao foi possivel excluir a versao.', 'data' => []];
    }
} else {
    $retorno = ['status' => 'nok', 'mensagem' => 'E necessario informar um ID para exclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
