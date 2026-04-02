<?php
    include_once('../z_php/conexao.php');

    $retorno = [
        'status' => '',
        'mensagem' => '',
        'data' => []
    ];

    if(isset($_GET['id'])) {
        $id = $_GET['id'];
        $stmt = $conexao->prepare("SELECT c.id, c.nome, c.cpf, c.email, c.endereco, c.curso_id, cu.nome as curso_nome, t.celular, t.residencial FROM coordenador c LEFT JOIN curso cu ON c.curso_id = cu.id LEFT JOIN telefone_coo t ON c.id = t.coordenador_id WHERE c.id = ? LIMIT 1");
        $stmt->bind_param("i", $id);
    } else {
        $stmt = $conexao->prepare("SELECT c.id, c.nome, c.cpf, c.email, c.endereco, c.curso_id, cu.nome as curso_nome, t.celular, t.residencial FROM coordenador c LEFT JOIN curso cu ON c.curso_id = cu.id LEFT JOIN telefone_coo t ON c.id = t.coordenador_id");
    }

    $stmt->execute();
    $resultado = $stmt->get_result();

    $tabela = [];
    if($resultado->num_rows > 0) {
        while($linha = $resultado->fetch_assoc()) {
            $tabela[] = $linha;
        }

        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Registros encontrados',
            'data' => $tabela
        ];
    } else {
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Nenhum registro encontrado',
            'data' => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($retorno);

