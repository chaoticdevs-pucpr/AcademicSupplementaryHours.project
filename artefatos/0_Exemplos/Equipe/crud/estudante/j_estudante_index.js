document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("novo").addEventListener("click", () => {
        window.location.href = 'h_estudante_novo.html';
    });
    document.getElementById("logoff").addEventListener("click", () => {
        logoff();
    });
    valida_sessao();
    carregarDados();
});

async function carregarDados(){
    const retorno = await fetch("p_estudante_get.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        const registros = resposta.data;

        var html = `<table>
        <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Endereço</th>
            <th>Celular</th>
            <th>Residencial</th>
            <th>Curso</th>
            <th>Turma</th>
            <th>#</th>
        </tr>`;
        for(var i=0; i<registros.length; i++){
            var objeto = registros[i];
            html += `<tr>
                        <td>${objeto.nome}</td>
                        <td>${objeto.cpf}</td>
                        <td>${objeto.email}</td>
                        <td>${objeto.endereco}</td>
                        <td>${objeto.celular}</td>
                        <td>${objeto.residencial}</td>
                        <td>${objeto.curso_nome || '-'}</td>
                        <td>${objeto.turma_nome || '-'}</td>
                        <td>
                        <a href='h_estudante_alterar.html?id=${encodeURIComponent(objeto.id)}'>Alterar</a>
                        <a href='#' onclick="excluir('${objeto.id}')">Excluir</a>
                        </td>
                    </tr>`;
        }
        html += "</table>";
        document.getElementById("lista").innerHTML += html;
        
    }else{
        alert("Erro:" + resposta.mensagem);
    }
}
async function excluir(id){
    const retorno = await fetch("p_estudante_excluir.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert(resposta.mensagem);
        window.location.reload();
    }else{
        alert("ERRO: " + resposta.mensagem)
    }
}