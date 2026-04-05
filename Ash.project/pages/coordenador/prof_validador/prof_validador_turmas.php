<?php
    include_once('../../../z_php/conexao.php');
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
    } // até aqui tá ok

    $stmtCurso = $conexao->prepare("SELECT curso_id FROM COORDENADOR WHERE usuario_id = ?"); // dá pra pegar o curso direto do coordenador --> ajuda do Copilot
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

    if(isset($_GET['id'])){
        $stmt = $conexao->prepare("SELECT t.id, t.nome, c.nome AS curso_nome FROM TURMA t INNER JOIN CURSO c ON c.id = t.curso_id WHERE t.curso_id = ? AND (t.prof_validador_id IS NULL OR t.prof_validador_id = ?) ORDER BY t.nome");
        $stmt->bind_param("ii", $curso_id, $_GET['id']);
    }else{
        $stmt = $conexao->prepare("SELECT t.id, t.nome, c.nome AS curso_nome, CASE WHEN t.prof_validador_id IS NULL THEN 0 ELSE 1 END AS ocupada FROM TURMA t INNER JOIN CURSO c ON c.id = t.curso_id WHERE t.curso_id = ? ORDER BY t.nome");
        $stmt->bind_param("i", $curso_id);
    }

    $stmt->execute();
    $resultado = $stmt->get_result();
    $tabela = [];
    while($linha = $resultado->fetch_assoc()){
        $tabela[] = $linha;
    }

    $retorno = [
        'status' => 'ok',
        'mensagem' => 'Consulta efetuada.',
        'data' => $tabela
    ];

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
