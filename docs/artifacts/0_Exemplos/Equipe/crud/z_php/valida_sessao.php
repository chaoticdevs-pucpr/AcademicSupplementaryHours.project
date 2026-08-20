<?php
    session_start();
    $retorno = [
        'status' => '',
        'mensagem' => '',
        'data' => []
    ];
    if(isset($_SESSION['usuario'])){
        $retorno = [
            'status' => 'ok',
            'mensagem' => '',
            'data' => []
        ];
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => '',
            'data' => []
        ];
    }

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);