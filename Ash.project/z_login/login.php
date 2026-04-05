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
            if($usuario['perfil'] == 'ADMIN'){
                $destino = 'pages/admin/index.html';
            }else if($usuario['perfil'] == 'COORDENADOR'){
                $destino = 'pages/coordenador/index.html';
            }else if($usuario['perfil'] == 'PROFESSOR'){
                $destino = 'pages/professor/index.html';
            }else if($usuario['perfil'] == 'ESTUDANTE'){
                $destino = 'pages/estudante/index.html';
            }


            $_SESSION['usuario'] = [
                'id'        => $usuario['id'],
                'email'     => $usuario['email'],
                'perfil'    => $usuario['perfil'],
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