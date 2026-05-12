<?php
    session_start();
    include_once('../z_php/conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    $stmt = $conexao->prepare("SELECT id, email, senha, perfil FROM USUARIO WHERE email = ?");
    $stmt->bind_param("s", $_POST['usuario']);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if($resultado->num_rows > 0){
        $usuario = $resultado->fetch_assoc();
        $senhaValida = ($_POST['senha'] == $usuario['senha']);

        if(!$senhaValida){
            if(function_exists('password_verify')){
                $senhaValida = password_verify($_POST['senha'], $usuario['senha']);
            }
        }

        if($senhaValida){
            $destino = '';
            $nome = '';
            if($usuario['perfil'] == 'ADMIN'){
                $destino = 'pages/admin/index.html';
                $stmt_nome = $conexao->prepare("SELECT nome FROM ADMINISTRADOR WHERE usuario_id = ?");
                $stmt_nome->bind_param("i", $usuario['id']);
                $stmt_nome->execute();
                $resultado_nome = $stmt_nome->get_result();
                if($resultado_nome->num_rows > 0){
                    $row = $resultado_nome->fetch_assoc();
                    $nome = $row['nome'];
                }
            }else if($usuario['perfil'] == 'COORDENADOR'){
                $destino = 'pages/coordenador/index.html';
                $stmt_nome = $conexao->prepare("SELECT nome FROM COORDENADOR WHERE usuario_id = ?");
                $stmt_nome->bind_param("i", $usuario['id']);
                $stmt_nome->execute();
                $resultado_nome = $stmt_nome->get_result();
                if($resultado_nome->num_rows > 0){
                    $row = $resultado_nome->fetch_assoc();
                    $nome = $row['nome'];
                }
            }else if($usuario['perfil'] == 'PROFESSOR'){
                $destino = 'pages/professor/index.html';
                $stmt_nome = $conexao->prepare("SELECT nome FROM PROF_VALIDADOR WHERE usuario_id = ?");
                $stmt_nome->bind_param("i", $usuario['id']);
                $stmt_nome->execute();
                $resultado_nome = $stmt_nome->get_result();
                if($resultado_nome->num_rows > 0){
                    $row = $resultado_nome->fetch_assoc();
                    $nome = $row['nome'];
                }
            }else if($usuario['perfil'] == 'ESTUDANTE'){
                $destino = 'pages/estudante/index.html';
                $stmt_nome = $conexao->prepare("SELECT nome FROM ESTUDANTE WHERE usuario_id = ?");
                $stmt_nome->bind_param("i", $usuario['id']);
                $stmt_nome->execute();
                $resultado_nome = $stmt_nome->get_result();
                if($resultado_nome->num_rows > 0){
                    $row = $resultado_nome->fetch_assoc();
                    $nome = $row['nome'];
                }
            }


            $_SESSION['usuario'] = [
                'id'        => $usuario['id'],
                'email'     => $usuario['email'],
                'perfil'    => $usuario['perfil'],
                'nome'      => $nome,
                'destino'   => $destino
            ];

            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Sucesso, login efetuado.',
                'data'      => [$_SESSION['usuario']]
            ];
        }else{
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Credenciais invalidas.',
                'data'      => []
            ];
        }
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Credenciais invalidas.',
            'data'      => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);

// Utilização do Copilot para auxílio na criação do código de login.