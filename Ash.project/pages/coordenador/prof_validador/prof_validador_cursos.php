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
    }

    $stmt = $conexao->prepare("SELECT id, nome FROM CURSO ORDER BY nome");
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
