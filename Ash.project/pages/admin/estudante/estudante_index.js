document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ADMIN');
    buscar();
});

document.getElementById("logoff").addEventListener("click", () => {
    logoff();
});

async function logoff(){
    const retorno = await fetch("../../../z_login/logoff.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        window.location.href = "../../../z_login/";
    }
}

async function buscar(){
    const retorno = await fetch("estudante_get.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        preencherTabela(resposta.data);
    }
}

async function excluir(id){
    const retorno = await fetch("estudante_excluir.php?id=" + id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert(resposta.mensagem);
        buscar();
    }else{
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela){
    var html = `<table border="1">
        <tr>
            <th>ID</th>
            <th>Matricula</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>CPF</th>
            <th>Celular</th>
            <th>Telefone</th>
            <th>Turma</th>
            <th>Curso</th>
            <th>#</th>
        </tr>`;

    for(var i = 0; i < tabela.length; i++){
        html += `<tr>
            <td>${tabela[i].id}</td>
            <td>${tabela[i].matricula_id ?? ''}</td>
            <td>${tabela[i].nome}</td>
            <td>${tabela[i].email}</td>
            <td>${tabela[i].cpf}</td>
            <td>${tabela[i].celular ?? ''}</td>
            <td>${tabela[i].telefone ?? ''}</td>
            <td>${tabela[i].turma_nome ?? ''}</td>
            <td>${tabela[i].curso_nome ?? ''}</td>
            <td>
                <a href="estudante_alterar.html?id=${tabela[i].id}">Alterar</a>
                <a href="#" onclick="excluir(${tabela[i].id})">Excluir</a>
            </td>
        </tr>`;
    }

    html += `</table>`;
    document.getElementById("lista").innerHTML = html;
}

