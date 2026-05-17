<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'PROFESSOR'){
    $retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit;
}

if(!isset($_GET['id'], $_POST['acao'])){
    $retorno = ['status' => 'nok', 'mensagem' => 'Parametros insuficientes.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit;
}

$professor_id = (int)$_SESSION['usuario']['id'];
$solicitacao_id = (int)$_GET['id'];
$acao = strtoupper(trim($_POST['acao']));
$justificativa_recusa = trim($_POST['justificativa_recusa'] ?? '');

$stmt = $conexao->prepare("SELECT id, horas_brutas, pontos_validados, status, justificativa FROM SOLICITACAO WHERE id = ? AND prof_validador_id = ? LIMIT 1");
$stmt->bind_param("ii", $solicitacao_id, $professor_id);
$stmt->execute();
$resultado = $stmt->get_result();

if($resultado->num_rows === 0){
    $stmt->close();
    $conexao->close();
    $retorno = ['status' => 'nok', 'mensagem' => 'Solicitação não encontrada.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit;
}

$solicitacao = $resultado->fetch_assoc();
$stmt->close();

if(strtoupper($solicitacao['status']) !== 'PENDENTE'){
    $conexao->close();
    $retorno = ['status' => 'nok', 'mensagem' => 'Somente solicitações pendentes podem ser avaliadas.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit;
}

$novos_status = null;
$novos_pontos_validados = 0;
$nova_justificativa = $solicitacao['justificativa'] ?? '';

if($acao === 'APROVAR'){
    $novos_status = 'APROVADO';
    $novos_pontos_validados = (float)$solicitacao['horas_brutas'];
} elseif($acao === 'RECUSAR'){
    if($justificativa_recusa === ''){
        $conexao->close();
        $retorno = ['status' => 'nok', 'mensagem' => 'Informe a justificativa da recusa.', 'data' => []];
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit;
    }

    $novos_status = 'RECUSADO';
    $novos_pontos_validados = 0;
    $prefixo = trim($nova_justificativa);
    $blocoRecusa = 'Justificativa de recusa do Professor Validador: ' . $justificativa_recusa;
    if($prefixo !== ''){
        $nova_justificativa = $prefixo . "\n\n" . $blocoRecusa;
    } else {
        $nova_justificativa = $blocoRecusa;
    }
} else {
    $conexao->close();
    $retorno = ['status' => 'nok', 'mensagem' => 'Ação inválida.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conexao->prepare("UPDATE SOLICITACAO SET status = ?, pontos_validados = ?, justificativa = ? WHERE id = ? AND prof_validador_id = ? AND status = 'PENDENTE'");
$stmt->bind_param("sdsii", $novos_status, $novos_pontos_validados, $nova_justificativa, $solicitacao_id, $professor_id);
$stmt->execute();

if($stmt->affected_rows > 0){
    $retorno = ['status' => 'ok', 'mensagem' => 'Solicitação atualizada com sucesso.', 'data' => []];
}else{
    $retorno = ['status' => 'nok', 'mensagem' => 'Não foi possível atualizar a solicitação.', 'data' => []];
}

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno, JSON_UNESCAPED_UNICODE);