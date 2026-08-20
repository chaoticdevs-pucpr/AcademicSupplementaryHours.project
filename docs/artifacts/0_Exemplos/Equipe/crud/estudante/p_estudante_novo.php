<?php
    include_once('../z_php/conexao.php');

    $retorno = [
        'status' => '',
        'mensagem' => '',
        'data' => []
    ];

    if (!isset($_POST['nome'], $_POST['cpf'], $_POST['email'], $_POST['endereco'], $_POST['celular'], $_POST['curso_id'], $_POST['turma_id'])) {
        $retorno['status'] = 'nok';
        $retorno['mensagem'] = 'Campos obrigatórios faltando';
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno);
        exit;
    }

    $nome = trim($_POST['nome']);
    $cpf = trim($_POST['cpf']);
    $email = trim($_POST['email']);
    $endereco = trim($_POST['endereco']);
    $celular = trim($_POST['celular']);
    $residencial = isset($_POST['residencial']) && $_POST['residencial'] !== '' ? trim($_POST['residencial']) : null;
    $curso_id = (int)$_POST['curso_id'];
    $turma_id = (int)$_POST['turma_id'];

    $stmt = $conexao->prepare("INSERT INTO estudante(nome, cpf, email, endereco, curso_id, turma_id) VALUES (?, ?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        $retorno['status'] = 'nok';
        $retorno['mensagem'] = 'Erro ao preparar: ' . $conexao->error;
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno);
        exit;
    }

    $stmt->bind_param("ssssii", $nome, $cpf, $email, $endereco, $curso_id, $turma_id);
    
    if (!$stmt->execute()) {
        $retorno['status'] = 'nok';
        $erro = $stmt->error;
        if (strpos($erro, 'cpf') !== false || strpos($erro, 'Duplicate entry') !== false) {
            $retorno['mensagem'] = 'Este CPF já foi cadastrado!';
        } elseif (strpos($erro, 'email') !== false) {
            $retorno['mensagem'] = 'Este email já foi cadastrado!';
        } else {
            $retorno['mensagem'] = 'Erro ao inserir: ' . $erro;
        }
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno);
        $stmt->close();
        $conexao->close();
        exit;
    }

    if($stmt->affected_rows > 0){
        $estudante_id = $conexao->insert_id;
        
        $stmt_telefone = $conexao->prepare("INSERT INTO telefone_estudante(estudante_id, celular, residencial) VALUES (?, ?, ?)");
        $stmt_telefone->bind_param("iss", $estudante_id, $celular, $residencial);
        $stmt_telefone->execute();
        
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Registro inserido com sucesso',
            'data' => []
        ];
        
        $stmt_telefone->close();
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Não foi possível inserir o registro: ' . $stmt->error,
            'data' => []
        ];
    }

    $stmt->close();
    $conexao->close();
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);