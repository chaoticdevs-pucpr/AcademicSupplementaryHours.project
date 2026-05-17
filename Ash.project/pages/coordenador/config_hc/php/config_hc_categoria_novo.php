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

if(isset($_POST['versao'], $_POST['categoria_nome'], $_POST['categoria_max'])){
    $versao = $_POST['versao'];
    $categoria_nome = trim($_POST['categoria_nome']);
    $categoria_max = (int)$_POST['categoria_max'];

    $stmt = $conexao->prepare("SELECT id FROM MANUAL_HC WHERE curso_id = ? AND versao = ? LIMIT 1");
    $stmt->bind_param("is", $curso_id, $versao);
    $stmt->execute();
    $resManual = $stmt->get_result();
    if($resManual->num_rows == 0){
        $retorno = ['status' => 'nok', 'mensagem' => 'Versão não encontrada.', 'data' => []];
        $stmt->close();
        $conexao->close();
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno);
        exit;
    }

    $manual = $resManual->fetch_assoc();
    $manual_id = (int)$manual['id'];
    $stmt->close();

    $stmt = $conexao->prepare("INSERT INTO CATEGORIA(manual_hc_id, max_pontos, nome) VALUES(?,?,?)");
    $stmt->bind_param("iis", $manual_id, $categoria_max, $categoria_nome);
    $stmt->execute();
    if($stmt->affected_rows > 0){
        $retorno = ['status' => 'ok', 'mensagem' => 'Categoria inserida com sucesso.', 'data' => []];
    } else {
        $retorno = ['status' => 'nok', 'mensagem' => 'Falha ao inserir categoria.', 'data' => []];
    }
    $stmt->close();
} else {
    $retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para inclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
