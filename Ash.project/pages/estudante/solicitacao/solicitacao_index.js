document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ESTUDANTE');
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
    const retorno = await fetch("solicitacao_get.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        preencherTabela(resposta.data);
    }
}

async function excluir(id){
    const retorno = await fetch("solicitacao_excluir.php?id=" + id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        buscar();
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}

function preencherTabela(tabela){
    var html = `<table border="1">
        <tr>
            <th>ID</th>
            <th>Categoria</th>
            <th>Subcategoria</th>
            <th>Horas Brutas</th>
            <th>Status</th>
            <th>Data</th>
            <th>Anexo</th>
            <th>#</th>
        </tr>`;

    for(var i = 0; i < tabela.length; i++){
        const item = tabela[i];
        const anexo = item.caminho_arquivo ? `<a href="../../../${item.caminho_arquivo}" target="_blank">Arquivo</a>` : '-';
        html += `<tr>
            <td>${item.id}</td>
            <td>${item.categoria_nome}</td>
            <td>${item.subcategoria_nome}</td>
            <td>${item.horas_brutas}</td>
            <td>${item.status}</td>
            <td>${item.data_envio}</td>
            <td>${anexo}</td>
            <td>
                <a href="solicitacao_alterar.html?id=${item.id}">Alterar</a>
                <a href="#" onclick="excluir(${item.id})">Excluir</a>
            </td>
        </tr>`;
    }

    html += `</table>`;
    document.getElementById("lista").innerHTML = html;
}
