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

function somente_digitos($valor){
    return preg_replace('/\D/', '', (string)$valor);
}

function email_valido($email){
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

if(isset($_GET['id']) && isset($_POST['nome'], $_POST['email'], $_POST['cpf'], $_POST['celular'], $_POST['telefone'], $_POST['curso_id'])){
    $id = (int)$_GET['id'];
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $senha = trim($_POST['senha'] ?? '');
    $cpf = somente_digitos($_POST['cpf'] ?? '');
    $celular = somente_digitos($_POST['celular'] ?? '');
    $telefone = somente_digitos($_POST['telefone'] ?? '');
    $curso_id = (int)$_POST['curso_id'];

    if($id <= 0 || $nome === '' || $email === '' || $senha === '' || $cpf === '' || $celular === '' || $curso_id <= 0){
        $retorno = ['status' => 'nok', 'mensagem' => 'Preencha todos os campos obrigatorios. Telefone e opcional.', 'data' => []];
    }else if(!email_valido($email)){
        $retorno = ['status' => 'nok', 'mensagem' => 'Informe um e-mail valido.', 'data' => []];
    }else if(strlen($cpf) != 11){
        $retorno = ['status' => 'nok', 'mensagem' => 'CPF invalido. Informe 11 digitos.', 'data' => []];
    }else if(strlen($celular) < 10 || strlen($celular) > 11){
        $retorno = ['status' => 'nok', 'mensagem' => 'Celular invalido. Informe 10 ou 11 digitos.', 'data' => []];
    }else if($telefone !== '' && (strlen($telefone) < 10 || strlen($telefone) > 11)){
        $retorno = ['status' => 'nok', 'mensagem' => 'Telefone invalido. Informe 10 ou 11 digitos.', 'data' => []];
    }else{
        $linhas_usuario = 0;

        $stmt = $conexao->prepare("UPDATE USUARIO SET email = ?, senha = ? WHERE id = ? AND perfil = 'COORDENADOR'");
        $stmt->bind_param("ssi", $email, $senha, $id);
        $stmt->execute();
        $linhas_usuario = $stmt->affected_rows;
        $stmt->close();

        $stmt = $conexao->prepare("UPDATE COORDENADOR SET nome = ?, cpf = ?, celular = ?, telefone = ?, curso_id = ? WHERE usuario_id = ?");
        $stmt->bind_param("ssssii", $nome, $cpf, $celular, $telefone, $curso_id, $id);
        $stmt->execute();
        $linhas_coordenador = $stmt->affected_rows;

        if($linhas_usuario > 0 || $linhas_coordenador > 0){
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
    }
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