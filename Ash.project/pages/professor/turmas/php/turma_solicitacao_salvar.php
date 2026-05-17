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

$stmt = $conexao->prepare("SELECT id, horas_brutas, duracao_unidade, duracao_unidade_tipo, pontos_validados, status, justificativa FROM SOLICITACAO WHERE id = ? AND prof_validador_id = ? LIMIT 1");
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
    // Buscar dados da subcategoria para aplicar regra de cálculo
    $stmt2 = $conexao->prepare("SELECT s.quant_pontos, s.tipo_calculo, s.unidade_referencia, s.valor_referencia, c.max_pontos FROM SUBCATEGORIA s JOIN CATEGORIA c ON s.categoria_id = c.id WHERE s.id = (SELECT subcategoria_id FROM SOLICITACAO WHERE id = ?) LIMIT 1");
    $stmt2->bind_param("i", $solicitacao_id);
    $stmt2->execute();
    $res2 = $stmt2->get_result();
    $sub = $res2->fetch_assoc();
    $stmt2->close();

    $horas_brutas = (float)$solicitacao['horas_brutas'];
    $duracao_unidade_val = isset($solicitacao['duracao_unidade']) ? (float)$solicitacao['duracao_unidade'] : 0.0;
    $duracao_unidade_tipo_val = strtoupper(trim($solicitacao['duracao_unidade_tipo'] ?? ''));
    $tipo = strtoupper(trim($sub['tipo_calculo'] ?? 'FIXO'));
    $unidade = strtoupper(trim($sub['unidade_referencia'] ?? 'PONTO'));
    $valor_ref = (float)($sub['valor_referencia'] ?? 1);
    $quant_pontos = (float)($sub['quant_pontos'] ?? 0);

    // Conversões padrão (horas por mês/semestre/ano)
    $HORAS_POR_MES = 160.0;
    $HORAS_POR_SEMESTRE = $HORAS_POR_MES * 6.0;
    $HORAS_POR_ANO = $HORAS_POR_MES * 12.0;

    $calculated = 0.0;
    if($tipo === 'FIXO'){
        $calculated = $quant_pontos;
    } elseif($tipo === 'HORA' || $unidade === 'HORA'){
        if($valor_ref <= 0) $valor_ref = 1;
        $blocks = floor($horas_brutas / $valor_ref);
        $calculated = $blocks * $quant_pontos;
    } elseif(in_array($tipo, ['PERIODO','ANO','SEMESTRE'])){
        // preferir duração informada pelo estudante quando compatível
        $unidades = 0.0;
        if($duracao_unidade_val > 0 && $duracao_unidade_tipo_val === $unidade){
            $unidades = $duracao_unidade_val;
        } else {
            // converter horas em unidades de periodo
            if($unidade === 'MES'){
                $unidades = $horas_brutas / $HORAS_POR_MES;
            } elseif($unidade === 'SEMESTRE'){
                $unidades = $horas_brutas / $HORAS_POR_SEMESTRE;
            } elseif($unidade === 'ANO'){
                $unidades = $horas_brutas / $HORAS_POR_ANO;
            } else {
                if($valor_ref <= 0) $valor_ref = 1;
                $unidades = $horas_brutas / $valor_ref;
            }
        }
        if($valor_ref <= 0) $valor_ref = 1;
        $blocks = floor($unidades / $valor_ref);
        $calculated = $blocks * $quant_pontos;
    } elseif($tipo === 'EVENTO'){
        // cada submissão conta como 1 por padrão :)
        $calculated = $quant_pontos;
    } else {
        // para FIXO
        $calculated = $quant_pontos;
    }

    $novos_status = 'APROVADO';
    $novos_pontos_validados = $calculated;
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