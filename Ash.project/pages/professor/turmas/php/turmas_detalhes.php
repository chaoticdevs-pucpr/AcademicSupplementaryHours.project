<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'PROFESSOR'){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Sem permissao.',
        'data' => []
    ];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

if(!isset($_GET['turma_id']) || (int)$_GET['turma_id'] <= 0){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Turma invalida.',
        'data' => []
    ];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$turma_id = (int)$_GET['turma_id'];
$professor_id = $_SESSION['usuario']['id'];

// Validar que o professor é responsável por esta turma
$stmtVal = $conexao->prepare("SELECT prof_validador_id FROM TURMA WHERE id = ?");
$stmtVal->bind_param("i", $turma_id);
$stmtVal->execute();
$resVal = $stmtVal->get_result();

if($resVal->num_rows == 0 || $resVal->fetch_assoc()['prof_validador_id'] != $professor_id){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Professor nao tem permissao para esta turma.',
        'data' => []
    ];
    $stmtVal->close();
    $conexao->close();
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}
$stmtVal->close();

// Buscar detalhes da turma
$stmtTurma = $conexao->prepare("SELECT t.id, t.nome, c.nome AS curso_nome FROM TURMA t INNER JOIN CURSO c ON c.id = t.curso_id WHERE t.id = ?");
$stmtTurma->bind_param("i", $turma_id);
$stmtTurma->execute();
$resTurma = $stmtTurma->get_result();

if($resTurma->num_rows == 0){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Turma nao encontrada.',
        'data' => []
    ];
    $stmtTurma->close();
    $conexao->close();
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$turma = $resTurma->fetch_assoc();
$stmtTurma->close();

// Buscar solicitações da turma
$stmt = $conexao->prepare("
    SELECT 
        s.id,
        m.estudante_id,
        e.nome AS estudante_nome,
        u.email,
        s.data_envios AS data_criacao,
        sc.nome AS descricao,
        s.horas_brutas AS horas_solicitadas,
        s.status,
        c.nome AS categoria
    FROM SOLICITACAO s
    INNER JOIN MATRICULA m ON m.id = s.matricula_id
    INNER JOIN ESTUDANTE e ON e.usuario_id = m.estudante_id
    INNER JOIN USUARIO u ON u.id = e.usuario_id
    INNER JOIN SUBCATEGORIA sc ON sc.id = s.subcategoria_id
    INNER JOIN CATEGORIA c ON c.id = sc.categoria_id
    WHERE m.turma_id = ? AND s.prof_validador_id = ?
    ORDER BY 
        CASE WHEN s.status = 'PENDENTE' THEN 0 ELSE 1 END,
        s.data_envios DESC
");

$stmt->bind_param("ii", $turma_id, $professor_id);
$stmt->execute();
$resultado = $stmt->get_result();
$solicitacoes = [];

while($linha = $resultado->fetch_assoc()){
    $solicitacoes[] = [
        'id' => (int)$linha['id'],
        'estudante_id' => (int)$linha['estudante_id'],
        'estudante_nome' => $linha['estudante_nome'],
        'email' => $linha['email'],
        'data_criacao' => $linha['data_criacao'],
        'descricao' => $linha['descricao'],
        'horas_solicitadas' => (float)($linha['horas_solicitadas'] ?? 0),
        'status' => $linha['status'],
        'categoria' => $linha['categoria']
    ];
}

$retorno = [
    'status' => 'ok',
    'mensagem' => 'Consulta efetuada.',
    'turma' => [
        'id' => (int)$turma['id'],
        'nome' => $turma['nome'],
        'curso_nome' => $turma['curso_nome']
    ],
    'data' => $solicitacoes
];

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
