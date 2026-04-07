<?php
    include_once('../z_php/conexao.php');

    $retorno = [
        'status' => '',
        'mensagem' => '',
        'data' => []
    ];

    if(isset($_GET['id'])) {
        $id = $_GET['id'];
        $stmt = $conexao->prepare("SELECT e.id, e.nome, e.cpf, e.email, e.endereco, e.curso_id, e.turma_id, c.nome as curso_nome, tu.nome as turma_nome, t.celular, t.residencial FROM estudante e LEFT JOIN curso c ON e.curso_id = c.id LEFT JOIN turma tu ON e.turma_id = tu.id LEFT JOIN telefone_estudante t ON e.id = t.estudante_id WHERE e.id = ? LIMIT 1");
        $stmt->bind_param("i", $id);
    } else {
        $stmt = $conexao->prepare("SELECT e.id, e.nome, e.cpf, e.email, e.endereco, e.curso_id, e.turma_id, c.nome as curso_nome, tu.nome as turma_nome, t.celular, t.residencial FROM estudante e LEFT JOIN curso c ON e.curso_id = c.id LEFT JOIN turma tu ON e.turma_id = tu.id LEFT JOIN telefone_estudante t ON e.id = t.estudante_id");
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

