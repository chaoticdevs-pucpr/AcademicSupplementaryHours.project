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

if(!isset($_GET['id'])){
    $retorno = ['status' => 'nok', 'mensagem' => 'Solicitação não informada.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit;
}

$professor_id = (int)$_SESSION['usuario']['id'];
$solicitacao_id = (int)$_GET['id'];

$stmt = $conexao->prepare("\n    SELECT\n        s.id,\n        s.status,\n        DATE_FORMAT(s.data_envios, '%Y-%m-%d %H:%i') AS data_envios,\n        s.horas_brutas,\n        s.horas_validadas,\n        s.justificativa,\n        su.nome AS subcategoria_nome,\n        c.nome AS categoria_nome,\n        t.nome AS turma_nome,\n        cu.nome AS curso_nome,\n        u.nome AS aluno_nome,\n        u.email AS aluno_email,\n        a.caminho_arquivo\n    FROM SOLICITACAO s\n    INNER JOIN MATRICULA m ON m.id = s.matricula_id\n    INNER JOIN ESTUDANTE e ON e.usuario_id = m.estudante_id\n    INNER JOIN USUARIO u ON u.id = e.usuario_id\n    INNER JOIN TURMA t ON t.id = s.turma_id\n    INNER JOIN CURSO cu ON cu.id = t.curso_id\n    INNER JOIN SUBCATEGORIA su ON su.id = s.subcategoria_id\n    INNER JOIN CATEGORIA c ON c.id = su.categoria_id\n    LEFT JOIN ANEXO a ON a.solicitacao_id = s.id\n    WHERE s.id = ? AND s.prof_validador_id = ?\n    LIMIT 1\n");
$stmt->bind_param("ii", $solicitacao_id, $professor_id);
$stmt->execute();
$resultado = $stmt->get_result();

if($resultado->num_rows > 0){
    $linha = $resultado->fetch_assoc();
    $retorno = [
        'status' => 'ok',
        'mensagem' => 'Consulta efetuada.',
        'data' => $linha
    ];
}else{
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Solicitação não encontrada.',
        'data' => []
    ];
}

$stmt->close();
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno, JSON_UNESCAPED_UNICODE);