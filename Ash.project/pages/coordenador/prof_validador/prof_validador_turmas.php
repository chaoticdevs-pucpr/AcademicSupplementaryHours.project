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
