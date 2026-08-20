<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'professor_nome' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'PROFESSOR'){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Sem permissao.',
        'professor_nome' => '',
        'data' => []
    ];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$professor_id = $_SESSION['usuario']['id'];

// Buscar nome do professor da sessão
$professor_nome = $_SESSION['usuario']['nome'] ?? "Professor";

// Buscar turmas do professor com contagem de pendências
$stmt = $conexao->prepare("
    SELECT 
        t.id,
        t.nome,
        c.nome AS curso_nome,
        YEAR(CURDATE()) AS ano,
        1 AS semestre,
        COUNT(DISTINCT m.estudante_id) AS total_alunos
    FROM TURMA t
    INNER JOIN CURSO c ON c.id = t.curso_id
    LEFT JOIN MATRICULA m ON m.turma_id = t.id
    WHERE t.prof_validador_id = ?
    GROUP BY t.id, t.nome, c.nome
    ORDER BY t.nome
");

$stmt->bind_param("i", $professor_id);
$stmt->execute();
$resultado = $stmt->get_result();
$tabela = [];

while($linha = $resultado->fetch_assoc()){
    // Contar pendências para esta turma
    $stmtPend = $conexao->prepare("
        SELECT COUNT(s.id) AS pendencias
        FROM SOLICITACAO s
        INNER JOIN MATRICULA m ON m.id = s.matricula_id
        WHERE m.turma_id = ? AND s.prof_validador_id = ? AND s.status = 'PENDENTE'
    ");
    $stmtPend->bind_param("ii", $linha['id'], $professor_id);
    $stmtPend->execute();
    $resPend = $stmtPend->get_result();
    $pendencias = 0;
    if($resPend->num_rows > 0){
        $pend = $resPend->fetch_assoc();
        $pendencias = (int)($pend['pendencias'] ?? 0);
    }
    $stmtPend->close();

    $tabela[] = [
        'id' => (int)$linha['id'],
        'nome' => $linha['nome'],
        'curso_nome' => $linha['curso_nome'],
        'ano' => $linha['ano'] ?? date('Y'),
        'periodo' => $linha['ano'] ?? date('Y'),
        'semestre' => (int)($linha['semestre'] ?? 1),
        'total_alunos' => (int)($linha['total_alunos'] ?? 0),
        'pendencias' => $pendencias
    ];
}

$retorno = [
    'status' => 'ok',
    'mensagem' => 'Consulta efetuada.',
    'professor_nome' => $professor_nome,
    'data' => $tabela
];

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
