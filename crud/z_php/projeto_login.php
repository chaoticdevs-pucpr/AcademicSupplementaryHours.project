<?php
    include_once('conexao.php');

    session_start();

    $retorno = [
        'status' => '',
        'mensagem' => '',
        'data' => []
    ];

    $stmt = $conexao->prepare("SELECT * FROM projeto WHERE usuario = ? AND senha = ?");
    $stmt->bind_param("ss", $_POST['usuario'], $_POST['senha']);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $tabela = [];
    if($resultado->num_rows > 0) {
        while($linha = $resultado->fetch_assoc()) {
            $tabela[] = $linha;
        }

        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Registros encontrados',
            'data' => $tabela
        ];

        $_SESSION['usuario'] = $tabela;

    } else {
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Nenhum registro encontrado',
            'data' => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
