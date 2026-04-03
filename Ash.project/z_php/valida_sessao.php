<?php
    session_start();
    $perfil = isset($_GET['perfil']) ? $_GET['perfil'] : '';

    if(isset($_SESSION['usuario'])){
        if($perfil != '' && $_SESSION['usuario']['perfil'] != $perfil){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => '',
                'data'      => []
            ];
        }else{
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => '',
                'data'      => [$_SESSION['usuario']]
            ];
        }
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Sessão expirada.',
            'data' => []
        ];
    }
    header("Content-type:application/json;charset:utf-8;");
    echo json_encode($retorno);