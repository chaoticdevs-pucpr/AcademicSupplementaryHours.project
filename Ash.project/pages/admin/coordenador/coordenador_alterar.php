<?php
include_once('../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'ADMIN'){
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Sem permissao.',
        'data' => []
    ];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

if(isset($_GET['id']) && isset($_POST['nome'], $_POST['email'], $_POST['cpf'], $_POST['celular'], $_POST['telefone'], $_POST['curso_id'])){
    $id = (int)$_GET['id'];
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = trim($_POST['senha']);
    $cpf = $_POST['cpf'];
    $celular = $_POST['celular'];
    $telefone = $_POST['telefone'];
    $curso_id = (int)$_POST['curso_id'];

    $linhas_usuario = 0;
    $ok_usuario = false;

    if($senha != ""){
        $stmt = $conexao->prepare("UPDATE USUARIO SET email = ?, senha = ? WHERE id = ? AND perfil = 'COORDENADOR'");
        $stmt->bind_param("ssi", $email, $senha, $id);
        $ok_usuario = $stmt->execute();
    }else{
        $stmt = $conexao->prepare("UPDATE USUARIO SET email = ? WHERE id = ? AND perfil = 'COORDENADOR'");
        $stmt->bind_param("si", $email, $id);
        $ok_usuario = $stmt->execute();
    }
    $linhas_usuario = $stmt->affected_rows;
    $stmt->close();

    $stmt = $conexao->prepare("UPDATE COORDENADOR SET nome = ?, cpf = ?, celular = ?, telefone = ?, curso_id = ? WHERE usuario_id = ?");
    $stmt->bind_param("ssssii", $nome, $cpf, $celular, $telefone, $curso_id, $id);
    $stmt->execute();
    $linhas_coordenador = $stmt->affected_rows;

    if($linhas_usuario > 0 || $linhas_coordenador > 0 || ($senha != "" && $ok_usuario)){
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Registro alterado com sucesso.',
            'data' => []
        ];
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Nao foi possivel alterar o registro.',
            'data' => []
        ];
    }
    $stmt->close();
}else{
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'Nao posso alterar sem informar ID.',
        'data' => []
    ];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);