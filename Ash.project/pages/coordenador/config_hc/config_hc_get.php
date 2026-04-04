<?php
include_once('../../../z_php/conexao.php');
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
    $stmt = $conexao->prepare("SELECT s.id AS subcategoria_id, m.versao, DATE_FORMAT(m.data, '%Y-%m-%d') AS data_manual, m.horas_objetivo, c.nome AS categoria_nome, c.max_horas, s.nome AS subcategoria_nome, s.quant_horas FROM MANUAL_HC m INNER JOIN CATEGORIA c ON c.manual_hc_id = m.id INNER JOIN SUBCATEGORIA s ON s.categoria_id = c.id WHERE m.curso_id = ? AND s.id = ?");
    $stmt->bind_param("ii", $curso_id, $_GET['id']);
}else{
    $stmt = $conexao->prepare("SELECT s.id AS subcategoria_id, m.versao, DATE_FORMAT(m.data, '%Y-%m-%d') AS data_manual, m.horas_objetivo, c.nome AS categoria_nome, c.max_horas, s.nome AS subcategoria_nome, s.quant_horas FROM MANUAL_HC m INNER JOIN CATEGORIA c ON c.manual_hc_id = m.id INNER JOIN SUBCATEGORIA s ON s.categoria_id = c.id WHERE m.curso_id = ? ORDER BY s.id DESC");
    $stmt->bind_param("i", $curso_id);
}

$stmt->execute();
$resultado = $stmt->get_result();
$tabela = [];
while($linha = $resultado->fetch_assoc()){
    $tabela[] = $linha;
}

if(count($tabela) > 0){
    $retorno = ['status' => 'ok', 'mensagem' => 'Consulta efetuada.', 'data' => $tabela];
}else{
    $retorno = ['status' => 'nok', 'mensagem' => 'Nao ha registros.', 'data' => []];
}

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
