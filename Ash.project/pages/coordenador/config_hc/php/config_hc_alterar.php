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

if(isset($_GET['id']) && isset($_POST['versao'], $_POST['data_manual'], $_POST['horas_objetivo'], $_POST['categoria_nome'], $_POST['categoria_max'], $_POST['subcategoria_nome'], $_POST['subcategoria_horas'])){
    $versao = $_POST['versao'];
    $data_manual = $_POST['data_manual'];
    $horas_objetivo = (int)$_POST['horas_objetivo'];
    $categoria_nome = $_POST['categoria_nome'];
    $categoria_max = (int)$_POST['categoria_max'];
    $subcategoria_nome = $_POST['subcategoria_nome'];
    $subcategoria_horas = (int)$_POST['subcategoria_horas'];
    $subcategoria_id = (int)$_GET['id'];

    $stmt = $conexao->prepare("UPDATE MANUAL_HC m INNER JOIN CATEGORIA c ON c.manual_hc_id = m.id INNER JOIN SUBCATEGORIA s ON s.categoria_id = c.id SET m.versao = ?, m.data = ?, m.horas_objetivo = ?, c.nome = ?, c.max_horas = ?, s.nome = ?, s.quant_horas = ? WHERE s.id = ? AND m.curso_id = ?");
    $stmt->bind_param("ssisssiii", $versao, $data_manual, $horas_objetivo, $categoria_nome, $categoria_max, $subcategoria_nome, $subcategoria_horas, $subcategoria_id, $curso_id);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $retorno = ['status' => 'ok', 'mensagem' => 'Registro alterado com sucesso.', 'data' => []];
    }else{
        $retorno = ['status' => 'nok', 'mensagem' => 'Nao foi possivel alterar.', 'data' => []];
    }
    $stmt->close();
}else{
    $retorno = ['status' => 'nok', 'mensagem' => 'Nao posso alterar sem informar ID.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
