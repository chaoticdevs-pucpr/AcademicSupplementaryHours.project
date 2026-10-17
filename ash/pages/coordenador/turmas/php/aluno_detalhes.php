<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'COORDENADOR'){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Sem permissao.',
        'data' => []
    ];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

if(!isset($_GET['matricula_id']) || (int)$_GET['matricula_id'] <= 0){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Matricula invalida.',
        'data' => []
    ];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$matricula_id = (int)$_GET['matricula_id'];

$stmtCurso = $conexao->prepare("SELECT co.curso_id FROM COORDENADOR co WHERE co.usuario_id = ?");
$stmtCurso->bind_param("i", $_SESSION['usuario']['id']);
$stmtCurso->execute();
$resCurso = $stmtCurso->get_result();

if($resCurso->num_rows == 0){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Coordenador sem curso vinculado.',
        'data' => []
    ];
    $stmtCurso->close();
    $conexao->close();
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$curso = $resCurso->fetch_assoc();
$curso_id = (int)$curso['curso_id'];
$stmtCurso->close();

$stmtMatricula = $conexao->prepare("SELECT m.id AS matricula_id, m.estudante_id, u.nome AS estudante_nome, t.id AS turma_id, t.curso_id FROM MATRICULA m INNER JOIN USUARIO u ON u.id = m.estudante_id INNER JOIN TURMA t ON t.id = m.turma_id WHERE m.id = ? AND t.curso_id = ?");
$stmtMatricula->bind_param("ii", $matricula_id, $curso_id);
$stmtMatricula->execute();
$resMatricula = $stmtMatricula->get_result();

if($resMatricula->num_rows == 0){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Matricula nao pertence ao curso deste coordenador.',
        'data' => []
    ];
    $stmtMatricula->close();
    $conexao->close();
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$matricula = $resMatricula->fetch_assoc();
$stmtMatricula->close();

$stmtDetalhes = $conexao->prepare("SELECT c.id AS categoria_id, c.nome AS categoria_nome, su.id AS subcategoria_id, su.nome AS subcategoria_nome, su.tipo_calculo, su.quant_pontos, COALESCE(SUM(CASE WHEN s.status = 'APROVADO' THEN s.pontos_validados ELSE 0 END), 0) AS horas_aprovadas, COALESCE(SUM(CASE WHEN s.status = 'PENDENTE' THEN s.pontos_validados ELSE 0 END), 0) AS horas_pendentes, COALESCE(SUM(CASE WHEN s.status IN ('APROVADO','PENDENTE') THEN 1 ELSE 0 END), 0) AS total_solicitacoes FROM CATEGORIA c INNER JOIN MANUAL_HC mh ON mh.id = c.manual_hc_id AND mh.curso_id = ? INNER JOIN SUBCATEGORIA su ON su.categoria_id = c.id LEFT JOIN SOLICITACAO s ON s.subcategoria_id = su.id AND s.matricula_id = ? GROUP BY c.id, c.nome, su.id, su.nome, su.tipo_calculo, su.quant_pontos ORDER BY c.nome, su.nome");
$stmtDetalhes->bind_param("ii", $curso_id, $matricula_id);
$stmtDetalhes->execute();
$resDetalhes = $stmtDetalhes->get_result();

$detalhes = [];
while($linha = $resDetalhes->fetch_assoc()){
    $detalhes[] = [
        'categoria_id' => $linha['categoria_id'],
        'categoria_nome' => $linha['categoria_nome'],
        'subcategoria_id' => $linha['subcategoria_id'],
        'subcategoria_nome' => $linha['subcategoria_nome'],
        'tipo_calculo' => $linha['tipo_calculo'],
        'quant_pontos' => (float)$linha['quant_pontos'],
        'horas_aprovadas' => (float)$linha['horas_aprovadas'],
        'horas_pendentes' => (float)$linha['horas_pendentes'],
        'total_solicitacoes' => (int)$linha['total_solicitacoes'],
    ];
}
$stmtDetalhes->close();

$retorno = [
    'status' => 'ok',
    'mensagem' => 'Detalhes do aluno carregados.',
    'data' => [
        'matricula_id' => $matricula['matricula_id'],
        'nome' => $matricula['estudante_nome'],
        'detalhes' => $detalhes
    ]
];

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
