<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'ADMIN'){
    $retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
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

if(isset($_GET['id']) && isset($_POST['nome'], $_POST['email'], $_POST['cpf'], $_POST['celular'], $_POST['telefone'], $_POST['turma_id'])){
    $id = (int)$_GET['id'];
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $senha = trim($_POST['senha'] ?? '');
    $cpf = somente_digitos($_POST['cpf'] ?? '');
    $celular = somente_digitos($_POST['celular'] ?? '');
    $telefone = somente_digitos($_POST['telefone'] ?? '');
    $turma_id = (int)$_POST['turma_id'];

    $erro = '';
    if($id <= 0 || $nome === '' || $email === '' || $senha === '' || $cpf === '' || $celular === '' || $turma_id <= 0){
        $erro = 'Preencha todos os campos obrigatorios. Telefone e opcional.';
    }else if(!email_valido($email)){
        $erro = 'Informe um e-mail valido.';
    }else if(strlen($cpf) != 11){
        $erro = 'CPF invalido. Informe 11 digitos.';
    }else if(strlen($celular) < 10 || strlen($celular) > 11){
        $erro = 'Celular invalido. Informe 10 ou 11 digitos.';
    }else if($telefone !== '' && (strlen($telefone) < 10 || strlen($telefone) > 11)){
        $erro = 'Telefone invalido. Informe 10 ou 11 digitos.';
    }else if($turma_id <= 0){
        $erro = 'Selecione uma turma valida.';
    }

    if($erro !== ''){
        $retorno = ['status' => 'nok', 'mensagem' => $erro, 'data' => []];
    }else{

    $linhas_usuario = 0;

    $stmt = $conexao->prepare("UPDATE USUARIO SET email = ?, senha = ? WHERE id = ? AND perfil = 'ESTUDANTE'");
    $stmt->bind_param("ssi", $email, $senha, $id);
    $stmt->execute();
    $linhas_usuario = $stmt->affected_rows;
    $stmt->close();

    $stmt = $conexao->prepare("UPDATE ESTUDANTE SET nome = ?, cpf = ?, celular = ?, telefone = ? WHERE usuario_id = ?");
    $stmt->bind_param("ssssi", $nome, $cpf, $celular, $telefone, $id);
    $stmt->execute();
    $linhas_estudante = $stmt->affected_rows;
    $stmt->close();

    $stmt = $conexao->prepare("UPDATE MATRICULA SET turma_id = ? WHERE estudante_id = ?");
    $stmt->bind_param("ii", $turma_id, $id);
    $stmt->execute();
    $linhas_matricula = $stmt->affected_rows;

    if($linhas_usuario > 0 || $linhas_estudante > 0 || $linhas_matricula > 0){
        $retorno = ['status' => 'ok', 'mensagem' => 'Registro alterado com sucesso.', 'data' => []];
    }else{
        $stmt->close();
        $stmt = $conexao->prepare("SELECT id FROM MATRICULA WHERE estudante_id = ? LIMIT 1");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if($resultado->num_rows == 0){
            $stmt->close();
            $stmt = $conexao->prepare("INSERT INTO MATRICULA(estudante_id, turma_id) VALUES(?,?)");
            $stmt->bind_param("ii", $id, $turma_id);
            $stmt->execute();
            if($stmt->affected_rows > 0){
                $retorno = ['status' => 'ok', 'mensagem' => 'Registro alterado com sucesso.', 'data' => []];
            }else{
                $retorno = ['status' => 'nok', 'mensagem' => 'Nao foi possivel alterar o registro.', 'data' => []];
            }
        }else{
            $retorno = ['status' => 'nok', 'mensagem' => 'Nao foi possivel alterar o registro.', 'data' => []];
        }
    }
    $stmt->close();
    }
}else{
    $retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para alteracao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
