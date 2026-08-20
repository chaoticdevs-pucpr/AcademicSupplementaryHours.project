<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status'    => '', // ok - nok
    'mensagem'  => '', // mensagem que envio para o front
    'data'      => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'ESTUDANTE'){
    $retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$estudante_id = (int)$_SESSION['usuario']['id'];

$stmtMatricula = $conexao->prepare("SELECT m.id, t.curso_id FROM MATRICULA m INNER JOIN TURMA t ON t.id = m.turma_id WHERE m.estudante_id = ? ORDER BY m.id LIMIT 1");
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
$curso_id = (int)$matricula['curso_id'];
$stmtMatricula->close();

$stmt = $conexao->prepare("SELECT c.id, c.nome FROM CATEGORIA c INNER JOIN MANUAL_HC m ON m.id = c.manual_hc_id WHERE m.curso_id = ? ORDER BY c.nome");
$stmt->bind_param("i", $curso_id);
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
if($resultado->num_rows > 0){
    while($linha = $resultado->fetch_assoc()){
        $tabela[] = $linha;
    }

    $retorno = [
        'status'    => 'ok', // ok - nok
        'mensagem'  => 'Consulta efetuada.', // mensagem que envio para o front
        'data'      => $tabela
    ];
}else{
    $retorno = [
        'status'    => 'nok', // ok - nok
        'mensagem'  => 'Nao ha categorias disponiveis', // mensagem que envio para o front
        'data'      => []
    ];
}

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
