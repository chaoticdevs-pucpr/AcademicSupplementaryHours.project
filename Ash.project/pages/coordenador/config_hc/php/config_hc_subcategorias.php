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

if(isset($_GET['subcategoria_id'])){
    $subcategoria_id = (int)$_GET['subcategoria_id'];
    $stmt = $conexao->prepare("SELECT s.id, s.nome, s.quant_pontos, s.descricao, s.tipo_calculo, s.unidade_referencia, s.valor_referencia, c.id AS categoria_id FROM SUBCATEGORIA s INNER JOIN CATEGORIA c ON c.id = s.categoria_id INNER JOIN MANUAL_HC m ON m.id = c.manual_hc_id WHERE s.id = ? AND m.curso_id = ? LIMIT 1");
    $stmt->bind_param("ii", $subcategoria_id, $curso_id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    if($linha = $resultado->fetch_assoc()){
        $retorno = ['status' => 'ok', 'mensagem' => 'Subcategoria encontrada.', 'data' => [$linha]];
    } else {
        $retorno = ['status' => 'nok', 'mensagem' => 'Subcategoria nao encontrada.', 'data' => []];
    }
    $stmt->close();
    $conexao->close();
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

if(!isset($_GET['categoria_id']) || (int)$_GET['categoria_id'] <= 0){
    $retorno = ['status' => 'nok', 'mensagem' => 'Categoria nao informada.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$categoria_id = (int)$_GET['categoria_id'];

$stmt = $conexao->prepare("SELECT s.id, s.nome, s.quant_pontos, s.descricao, s.tipo_calculo, s.unidade_referencia, s.valor_referencia FROM SUBCATEGORIA s INNER JOIN CATEGORIA c ON c.id = s.categoria_id INNER JOIN MANUAL_HC m ON m.id = c.manual_hc_id WHERE m.curso_id = ? AND s.categoria_id = ? ORDER BY s.nome");
$stmt->bind_param("ii", $curso_id, $categoria_id);
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
while($linha = $resultado->fetch_assoc()){
    $tabela[] = $linha;
}
$stmt->close();

$retorno = ['status' => 'ok', 'mensagem' => 'Consulta efetuada.', 'data' => $tabela];
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);