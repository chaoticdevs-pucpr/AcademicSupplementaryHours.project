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

if(isset($_GET['id'], $_POST['subcategoria_nome'], $_POST['subcategoria_horas'])){
    $subcategoria_id = (int)$_GET['id'];
    $subcategoria_nome = trim($_POST['subcategoria_nome']);
    $subcategoria_horas = (int)$_POST['subcategoria_horas'];
    $tipo_calculo = strtoupper(trim($_POST['tipo_calculo'] ?? 'FIXO'));
    $unidade_referencia = trim($_POST['unidade_referencia'] ?? 'PONTO');
    $valor_referencia = (float)($_POST['valor_referencia'] ?? 1);
    $subcategoria_descricao = trim($_POST['subcategoria_descricao'] ?? '');

    $tipos_validos = ['FIXO', 'HORA', 'PERIODO', 'ANO', 'SEMESTRE'];
    if(!in_array($tipo_calculo, $tipos_validos, true)){
        $tipo_calculo = 'FIXO';
    }
    if($unidade_referencia === ''){
        $unidade_referencia = 'PONTO';
    }
    if($valor_referencia <= 0){
        $valor_referencia = 1;
    }

    $stmt = $conexao->prepare("UPDATE SUBCATEGORIA s INNER JOIN CATEGORIA c ON c.id = s.categoria_id INNER JOIN MANUAL_HC m ON m.id = c.manual_hc_id SET s.nome = ?, s.quant_pontos = ?, s.descricao = ?, s.tipo_calculo = ?, s.unidade_referencia = ?, s.valor_referencia = ? WHERE s.id = ? AND m.curso_id = ?");
    $stmt->bind_param("sisssdii", $subcategoria_nome, $subcategoria_horas, $subcategoria_descricao, $tipo_calculo, $unidade_referencia, $valor_referencia, $subcategoria_id, $curso_id);
    $stmt->execute();
    if($stmt->affected_rows > 0){
        $retorno = ['status' => 'ok', 'mensagem' => 'Subcategoria alterada com sucesso.', 'data' => []];
    } else {
        $retorno = ['status' => 'nok', 'mensagem' => 'Nao foi possivel alterar a subcategoria.', 'data' => []];
    }
    $stmt->close();
} else {
    $retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para alteracao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
