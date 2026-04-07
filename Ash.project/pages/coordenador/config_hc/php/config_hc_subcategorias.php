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

if(!isset($_GET['categoria_id']) || (int)$_GET['categoria_id'] <= 0){
    $retorno = ['status' => 'nok', 'mensagem' => 'Categoria nao informada.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$categoria_id = (int)$_GET['categoria_id'];

$stmt = $conexao->prepare("SELECT s.id, s.nome, s.quant_horas FROM SUBCATEGORIA s INNER JOIN CATEGORIA c ON c.id = s.categoria_id INNER JOIN MANUAL_HC m ON m.id = c.manual_hc_id WHERE m.curso_id = ? AND s.categoria_id = ? ORDER BY s.nome");
$stmt->bind_param("ii", $curso_id, $categoria_id);
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
while($linha = $resultado->fetch_assoc()){
    $tabela[] = $linha;
}
$stmt->close();

if(count($tabela) == 0){
    $stmtGlobal = $conexao->prepare("SELECT s.id, s.nome, s.quant_horas FROM SUBCATEGORIA s WHERE s.categoria_id = ? ORDER BY s.nome");
    $stmtGlobal->bind_param("i", $categoria_id);
    $stmtGlobal->execute();
    $resultadoGlobal = $stmtGlobal->get_result();
    while($linha = $resultadoGlobal->fetch_assoc()){
        $tabela[] = $linha;
    }
    $stmtGlobal->close();
}

$retorno = ['status' => 'ok', 'mensagem' => 'Consulta efetuada.', 'data' => $tabela];
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);