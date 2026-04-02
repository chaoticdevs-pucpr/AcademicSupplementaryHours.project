<?php
    include_once('conexao.php');
    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];
    // Simulando as informações que vem do front
    $nome       = $_POST['nome']; // $_POST['nome'];
    $email      = $_POST['email'];
    $usuario    = $_POST['usuario'];
    $senha      = $_POST['senha'];
    $instagram   = $_POST['instagram'];
    $ativo      = (int) $_POST['ativo'];

    // Preparando para inserção no banco de dados
    $stmt = $conexao->prepare("
    INSERT INTO cliente(nome, email, usuario, senha, instagram, ativo) VALUES(?,?,?,?,?,?)");
    $stmt->bind_param("sssssi",$nome, $email, $usuario, $senha, $instagram, $ativo);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'registro inserido com sucesso',
            'data' => []
        ];
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'falha ao inserir o registro',
            'data' => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);