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
    $senha = $_POST['senha'];
    $cpf = $_POST['cpf'];
    $celular = $_POST['celular'];
    $telefone = $_POST['telefone'];
    $curso_id = (int)$_POST['curso_id'];

    if($senha != ""){
        $stmt = $conexao->prepare("UPDATE USUARIO SET email = ?, senha = ? WHERE id = ? AND perfil = 'COORDENADOR'");
        $stmt->bind_param("ssi", $email, $senha, $id);
        $stmt->execute();
    }else{
        $stmt = $conexao->prepare("UPDATE USUARIO SET email = ? WHERE id = ? AND perfil = 'COORDENADOR'");
        $stmt->bind_param("si", $email, $id);
        $stmt->execute();
    }
    $stmt->close();

    $stmt = $conexao->prepare("UPDATE COORDENADOR SET nome = ?, cpf = ?, celular = ?, telefone = ?, curso_id = ? WHERE usuario_id = ?");
    $stmt->bind_param("ssssii", $nome, $cpf, $celular, $telefone, $curso_id, $id);
    $stmt->execute();

    if($stmt->affected_rows > 0){
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