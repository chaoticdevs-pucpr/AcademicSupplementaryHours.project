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

$stmt = $conexao->prepare("SELECT c.id, c.nome, c.max_horas FROM CATEGORIA c INNER JOIN MANUAL_HC m ON m.id = c.manual_hc_id WHERE m.curso_id = ? ORDER BY c.nome");
$stmt->bind_param("i", $curso_id);
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
while($linha = $resultado->fetch_assoc()){
    $tabela[] = $linha;
}
$stmt->close();

if(count($tabela) == 0){
    $stmtGlobal = $conexao->prepare("SELECT id, nome, max_horas FROM CATEGORIA ORDER BY nome");
    $stmtGlobal->execute();
    $resultadoGlobal = $stmtGlobal->get_result();
    while($linha = $resultadoGlobal->fetch_assoc()){
        $tabela[] = $linha;
    }
    $stmtGlobal->close();
}

if(count($tabela) > 0){
    $retorno = ['status' => 'ok', 'mensagem' => 'Consulta efetuada.', 'data' => $tabela];
}else{
    $retorno = ['status' => 'nok', 'mensagem' => 'Nao ha categorias disponiveis.', 'data' => []];
}
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);