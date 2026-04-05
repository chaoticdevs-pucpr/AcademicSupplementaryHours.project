<?php
include_once('../../../z_php/conexao.php');
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

if(isset($_GET['id']) && isset($_POST['nome'], $_POST['email'], $_POST['cpf'], $_POST['celular'], $_POST['telefone'], $_POST['turma_id'])){
    $id = (int)$_GET['id'];
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = trim($_POST['senha']);
    $cpf = $_POST['cpf'];
    $celular = $_POST['celular'];
    $telefone = $_POST['telefone'];
    $turma_id = (int)$_POST['turma_id'];

    if($turma_id <= 0){
        $retorno = ['status' => 'nok', 'mensagem' => 'Selecione uma turma valida.', 'data' => []];
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno);
        exit;
    }

    $linhas_usuario = 0;
    $ok_usuario = false;

    if($senha != ""){
        $stmt = $conexao->prepare("UPDATE USUARIO SET email = ?, senha = ? WHERE id = ? AND perfil = 'ESTUDANTE'");
        $stmt->bind_param("ssi", $email, $senha, $id);
        $ok_usuario = $stmt->execute();
    }else{
        $stmt = $conexao->prepare("UPDATE USUARIO SET email = ? WHERE id = ? AND perfil = 'ESTUDANTE'");
        $stmt->bind_param("si", $email, $id);
        $ok_usuario = $stmt->execute();
    }
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

    if($linhas_usuario > 0 || $linhas_estudante > 0 || $linhas_matricula > 0 || ($senha != "" && $ok_usuario)){
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
}else{
    $retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para alteracao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
