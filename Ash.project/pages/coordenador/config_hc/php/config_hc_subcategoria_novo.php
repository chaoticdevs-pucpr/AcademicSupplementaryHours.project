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

if(isset($_POST['categoria_id'], $_POST['subcategoria_nome'], $_POST['subcategoria_horas'])){
    $categoria_id = (int)$_POST['categoria_id'];
    $subcategoria_nome = trim($_POST['subcategoria_nome']);
    $subcategoria_horas = (int)$_POST['subcategoria_horas'];
    $subcategoria_descricao = trim($_POST['subcategoria_descricao'] ?? '');

    $stmt = $conexao->prepare("SELECT c.id FROM CATEGORIA c INNER JOIN MANUAL_HC m ON m.id = c.manual_hc_id WHERE c.id = ? AND m.curso_id = ? LIMIT 1");
    $stmt->bind_param("ii", $categoria_id, $curso_id);
    $stmt->execute();
    $resCategoria = $stmt->get_result();
    if($resCategoria->num_rows == 0){
        $retorno = ['status' => 'nok', 'mensagem' => 'Categoria nao encontrada ou nao pertence ao curso.', 'data' => []];
        $stmt->close();
        $conexao->close();
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno);
        exit;
    }
    $stmt->close();

    $stmt = $conexao->prepare("INSERT INTO SUBCATEGORIA(categoria_id, nome, quant_pontos, descricao) VALUES(?,?,?,?)");
    $stmt->bind_param("isis", $categoria_id, $subcategoria_nome, $subcategoria_horas, $subcategoria_descricao);
    $stmt->execute();
    if($stmt->affected_rows > 0){
        $retorno = ['status' => 'ok', 'mensagem' => 'Subcategoria inserida com sucesso.', 'data' => []];
    } else {
        $retorno = ['status' => 'nok', 'mensagem' => 'Falha ao inserir subcategoria.', 'data' => []];
    }
    $stmt->close();
} else {
    $retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para inclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
