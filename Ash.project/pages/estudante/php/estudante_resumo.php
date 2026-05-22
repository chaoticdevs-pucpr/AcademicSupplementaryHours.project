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
    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit;
}

$estudante_id = (int)$_SESSION['usuario']['id'];
$nome_usuario = $_SESSION['usuario']['nome'] ?? 'Estudante';

$stmtMatricula = $conexao->prepare("SELECT m.id AS matricula_id, t.curso_id, cu.nome AS curso_nome, mh.horas_objetivo FROM MATRICULA m INNER JOIN TURMA t ON t.id = m.turma_id INNER JOIN CURSO cu ON cu.id = t.curso_id INNER JOIN MANUAL_HC mh ON mh.curso_id = t.curso_id WHERE m.estudante_id = ? ORDER BY m.id LIMIT 1");
$stmtMatricula->bind_param("i", $estudante_id);
$stmtMatricula->execute();
$resMatricula = $stmtMatricula->get_result();

if($resMatricula->num_rows == 0){
    $retorno = ['status' => 'nok', 'mensagem' => 'Estudante sem matricula ativa.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit;
}

$matricula = $resMatricula->fetch_assoc();
$matricula_id = (int)$matricula['matricula_id'];
$curso_id = (int)$matricula['curso_id'];
$horas_objetivo = (float)($matricula['horas_objetivo'] ?? 0);
$stmtMatricula->close();

$stmtCategorias = $conexao->prepare("SELECT c.id AS categoria_id, c.nome AS categoria_nome, c.max_pontos, COALESCE(SUM(CASE WHEN s.status = 'APROVADO' THEN s.pontos_validados ELSE 0 END), 0) AS total_pontos FROM CATEGORIA c INNER JOIN MANUAL_HC mh ON mh.id = c.manual_hc_id AND mh.curso_id = ? LEFT JOIN SUBCATEGORIA su ON su.categoria_id = c.id LEFT JOIN SOLICITACAO s ON s.subcategoria_id = su.id AND s.matricula_id = ? GROUP BY c.id, c.nome, c.max_pontos ORDER BY c.nome");
$stmtCategorias->bind_param("ii", $curso_id, $matricula_id);
$stmtCategorias->execute();
$resultadoCategorias = $stmtCategorias->get_result();

$categorias = [];
$total_aprovado = 0;
while($linha = $resultadoCategorias->fetch_assoc()){
    $linha['max_pontos'] = (float)$linha['max_pontos'];
    $linha['total_pontos'] = (float)$linha['total_pontos'];
    $total_aprovado += $linha['total_pontos'];
    $categorias[] = $linha;
}
$stmtCategorias->close();

$stmtSubcategorias = $conexao->prepare("SELECT su.id AS subcategoria_id, su.nome AS subcategoria_nome, su.quant_pontos, su.tipo_calculo, su.unidade_referencia, su.valor_referencia, c.id AS categoria_id, c.nome AS categoria_nome, c.max_pontos, COALESCE(SUM(CASE WHEN s.status = 'APROVADO' THEN s.pontos_validados ELSE 0 END), 0) AS total_pontos, COALESCE(SUM(CASE WHEN s.status = 'PENDENTE' THEN 1 ELSE 0 END), 0) AS total_solicitacoes FROM SUBCATEGORIA su INNER JOIN CATEGORIA c ON c.id = su.categoria_id INNER JOIN MANUAL_HC mh ON mh.id = c.manual_hc_id AND mh.curso_id = ? LEFT JOIN SOLICITACAO s ON s.subcategoria_id = su.id AND s.matricula_id = ? GROUP BY su.id, su.nome, su.quant_pontos, su.tipo_calculo, su.unidade_referencia, su.valor_referencia, c.id, c.nome, c.max_pontos ORDER BY c.nome, su.nome");
$stmtSubcategorias->bind_param("ii", $curso_id, $matricula_id);
$stmtSubcategorias->execute();
$resultadoSubcategorias = $stmtSubcategorias->get_result();

$subcategorias = [];
while($linha = $resultadoSubcategorias->fetch_assoc()){
    $linha['quant_pontos'] = (float)$linha['quant_pontos'];
    $linha['valor_referencia'] = (float)$linha['valor_referencia'];
    $linha['max_pontos'] = (float)$linha['max_pontos'];
    $linha['total_pontos'] = (float)$linha['total_pontos'];
    $linha['total_solicitacoes'] = (int)$linha['total_solicitacoes'];
    $subcategorias[] = $linha;
}
$stmtSubcategorias->close();

$percentual = $horas_objetivo > 0 ? min(100, ($total_aprovado / $horas_objetivo) * 100) : 0;

$retorno = [
    'status' => 'ok',
    'mensagem' => 'Consulta efetuada.',
    'data' => [
        'nome_usuario' => $nome_usuario,
        'curso_nome' => $matricula['curso_nome'] ?? '',
        'horas_objetivo' => $horas_objetivo,
        'total_aprovado' => $total_aprovado,
        'percentual' => $percentual,
        'categorias' => $categorias,
        'subcategorias' => $subcategorias
    ]
];

$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
