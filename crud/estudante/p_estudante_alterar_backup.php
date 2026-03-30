<?php
    include_once('../z_php/conexao.php');

    $retorno = [
        'status' => '',
        'mensagem' => '',
        'data' => []
    ];

    if(isset($_GET['id'])) {
        $id = $_GET['id'];
        
        $nome = trim($_POST['nome']);
        $cpf = trim($_POST['cpf']);
        $email = trim($_POST['email']);
        $endereco = trim($_POST['endereco']);
        $celular = trim($_POST['celular']);
        $residencial = isset($_POST['residencial']) && $_POST['residencial'] !== '' ? trim($_POST['residencial']) : null;
        $curso_id = (int)$_POST['curso_id'];
        $turma_id = (int)$_POST['turma_id'];

        $stmt = $conexao->prepare("UPDATE estudante SET nome = ?, cpf = ?, email = ?, endereco = ?, curso_id = ?, turma_id = ? WHERE id = ?");
        $stmt->bind_param("sssiii", $nome, $cpf, $email, $endereco, $curso_id, $turma_id, $id);
        $stmt->execute();

        if($stmt->affected_rows >= 0){
            $stmt_telefone = $conexao->prepare("UPDATE telefone_estudante SET celular = ?, residencial = ? WHERE estudante_id = ?");
            $stmt_telefone->bind_param("ssi", $celular, $residencial, $id);
            $stmt_telefone->execute();
            
            $retorno = [
                'status' => 'ok',
                'mensagem' => 'Registro alterado com sucesso',
                'data' => []
            ];
            
            $stmt_telefone->close();
        }else{
            $retorno = [
                'status' => 'nok',
                'mensagem' => 'Não foi possível alterar o registro',
                'data' => []
            ];
        }

        $stmt->close();
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Não foi possível alterar o registro sem ID',
            'data' => []
        ];
    }
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
?>
