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

$stmt = $conexao->prepare("SELECT s.id, s.matricula_id, s.subcategoria_id, s.horas_brutas, s.pontos_validados, s.status, s.justificativa, su.quant_pontos AS subcategoria_pontos, c.max_pontos AS categoria_max_pontos, c.id AS categoria_id FROM SOLICITACAO s INNER JOIN SUBCATEGORIA su ON su.id = s.subcategoria_id INNER JOIN CATEGORIA c ON c.id = su.categoria_id WHERE s.id = ? AND s.prof_validador_id = ? LIMIT 1");
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
    $pontos_recebidos = trim($_POST['pontos_validados'] ?? '');
    if($pontos_recebidos === '' || !is_numeric($pontos_recebidos)){
        $conexao->close();
        $retorno = ['status' => 'nok', 'mensagem' => 'Informe os pontos validados para aprovar.', 'data' => []];
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit;
    }

    $pontos_recebidos = (float)$pontos_recebidos;
    $limiteSubcategoria = (float)($solicitacao['subcategoria_pontos'] ?? 0);
    $limiteCategoria = (float)($solicitacao['categoria_max_pontos'] ?? 0);

    if($pontos_recebidos <= 0 || $pontos_recebidos > $limiteSubcategoria){
        $conexao->close();
        $retorno = ['status' => 'nok', 'mensagem' => 'Os pontos validados precisam estar entre 0 e o limite da subcategoria.', 'data' => []];
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmtCategoria = $conexao->prepare("SELECT COALESCE(SUM(s.pontos_validados), 0) AS total_categoria FROM SOLICITACAO s INNER JOIN SUBCATEGORIA su ON su.id = s.subcategoria_id WHERE s.matricula_id = ? AND su.categoria_id = ? AND s.status = 'APROVADO'");
    $stmtCategoria->bind_param("ii", $solicitacao['matricula_id'], $solicitacao['categoria_id']);
    $stmtCategoria->execute();
    $resultadoCategoria = $stmtCategoria->get_result();
    $linhaCategoria = $resultadoCategoria->fetch_assoc();
    $totalCategoriaAtual = (float)($linhaCategoria['total_categoria'] ?? 0);
    $stmtCategoria->close();

    if(($totalCategoriaAtual + $pontos_recebidos) > $limiteCategoria){
        $conexao->close();
        $retorno = ['status' => 'nok', 'mensagem' => 'A categoria já atingiu o limite de pontos permitidos.', 'data' => []];
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        exit;
    }

    $novos_status = 'APROVADO';
    $novos_pontos_validados = $pontos_recebidos;
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

$conexao->begin_transaction();

$stmt = $conexao->prepare("UPDATE SOLICITACAO SET status = ?, pontos_validados = ?, justificativa = ? WHERE id = ? AND prof_validador_id = ? AND status = 'PENDENTE'");
$stmt->bind_param("sdsii", $novos_status, $novos_pontos_validados, $nova_justificativa, $solicitacao_id, $professor_id);
$stmt->execute();

if($stmt->affected_rows > 0){
    if($novos_status === 'APROVADO'){
        $stmtMatricula = $conexao->prepare("UPDATE MATRICULA SET total_pontos = total_pontos + ? WHERE id = ?");
        $stmtMatricula->bind_param("di", $novos_pontos_validados, $solicitacao['matricula_id']);
        $stmtMatricula->execute();
        if($stmtMatricula->affected_rows <= 0){
            $stmtMatricula->close();
            $stmt->close();
            $conexao->rollback();
            $conexao->close();
            $retorno = ['status' => 'nok', 'mensagem' => 'Não foi possível atualizar a matrícula.', 'data' => []];
            header("Content-type:application/json;charset:utf-8");
            echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
            exit;
        }
        $stmtMatricula->close();
    }

    $conexao->commit();
    $retorno = ['status' => 'ok', 'mensagem' => 'Solicitação atualizada com sucesso.', 'data' => []];
}else{
    $conexao->rollback();
    $retorno = ['status' => 'nok', 'mensagem' => 'Não foi possível atualizar a solicitação.', 'data' => []];
}

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno, JSON_UNESCAPED_UNICODE);