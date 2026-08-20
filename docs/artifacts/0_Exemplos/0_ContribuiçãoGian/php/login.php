<?php
    include_once('conexao.php');
    // Configurando o padrão de retorno em todas
    // as situações
    $retorno = [
        'status'    => '', // ok - nok
        'mensagem'  => '', // mensagem que envio para o front
        'data'      => []
    ];
    // Tabelas do banco de dados, que descobrira em qual tabela sera o usuario
    $Tabela_certa = ''; 
    $Achou_usuario = false;
    $Tabelas =[
        'Estudante',
        'Professor',
        'Professor_validador',
        'Coordenador',
        'Administrador'
    ];
    foreach($Tabelas as $Tabela_atual){
        // Preparando a consulta no banco de dados
        $stmt = $conexao->prepare("SELECT * FROM $Tabela_atual WHERE usuario = ? AND senha = ?");
        $stmt->bind_param("ss",$usuario, $senha);
        // Recuperando informações do banco de dados
        // Vou executar a query
        $stmt->execute();
        $resultado = $stmt->get_result();
        if($resultado->num_rows > 0){
            $Tabela_certa = $Tabela_atual;
            $Achou_usuario = true;
            break;
        }
    }

    if($Achou_usuario){
        while($linha = $resultado->fetch_assoc()){
            $tabela[] = $linha;
        }

        session_start();
        $_SESSION['usuario'] = $tabela;

        $retorno = [
            'status'    => 'ok', // ok - nok
            'mensagem'  => 'Sucesso, consulta efetuada.', // mensagem que envio para o front
            'data'      => $tabela
        ];
    }else{
        $retorno = [
            'status'    => 'nok', // ok - nok
            'mensagem'  => 'Não há registros', // mensagem que envio para o front
            'data'      => []
        ];
    }
    // Fechamento do estado e conexão.
    $stmt->close();
    $conexao->close();

    // Estou enviando para o FRONT o array RETORNO
    // mas no formato JSON
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);