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
    $stmt = $conexao->prepare("SELECT s.id, s.subcategoria_id, s.horas_brutas, s.justificativa FROM SOLICITACAO s WHERE s.id = ? AND s.matricula_id = ?");
    $stmt->bind_param("ii", $_GET['id'], $matricula_id);
}else{
    $stmt = $conexao->prepare("SELECT s.id, s.subcategoria_id, s.horas_brutas, s.status, DATE_FORMAT(s.data_envio, '%Y-%m-%d %H:%i') AS data_envio, s.justificativa, su.nome AS subcategoria_nome, c.nome AS categoria_nome, a.caminho_arquivo FROM SOLICITACAO s INNER JOIN SUBCATEGORIA su ON su.id = s.subcategoria_id INNER JOIN CATEGORIA c ON c.id = su.categoria_id LEFT JOIN ANEXO a ON a.solicitacao_id = s.id WHERE s.matricula_id = ? ORDER BY s.id DESC");
    $stmt->bind_param("i", $matricula_id);
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
