<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

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

if(isset($_GET['id'], $_POST['categoria_nome'], $_POST['categoria_max'])){
    $categoria_id = (int)$_GET['id'];
    $categoria_nome = trim($_POST['categoria_nome']);
    $categoria_max = (int)$_POST['categoria_max'];
    $categoria_descricao = trim($_POST['categoria_descricao'] ?? '');

    $stmt = $conexao->prepare("UPDATE CATEGORIA c INNER JOIN MANUAL_HC m ON m.id = c.manual_hc_id SET c.nome = ?, c.max_pontos = ?, c.descricao = ? WHERE c.id = ? AND m.curso_id = ?");
    $stmt->bind_param("sisii", $categoria_nome, $categoria_max, $categoria_descricao, $categoria_id, $curso_id);
    $stmt->execute();
    if($stmt->affected_rows > 0){
        $retorno = ['status' => 'ok', 'mensagem' => 'Categoria alterada com sucesso.', 'data' => []];
    } else {
        $retorno = ['status' => 'nok', 'mensagem' => 'Nao foi possivel alterar a categoria.', 'data' => []];
    }
    $stmt->close();
} else {
    $retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para alteracao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
