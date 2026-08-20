document.addEventListener("DOMContentLoaded", () => {
    valida_sessao();
    buscar();
});

document.getElementById("novo").addEventListener("click", () => {
    window.location.href = 'cliente_novo.html';
});

document.getElementById("logoff").addEventListener("click", () => {
    logoff();
});

async function logoff(){
    const retorno = await fetch("../php/cliente_logoff.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        window.location.href = '../login/';   
    }
}
async function buscar(){
    const retorno = await fetch("../php/cliente_get.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        preencherTabela(resposta.data);    
    }
}

async function excluir(id){
    const retorno = await fetch("../php/cliente_excluir.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert(resposta.mensagem);
        window.location.reload();    
    }else{
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela){
    var html = `
        <table>
            <tr>
                <th> Nome </th>
                <th> Usuario </th>
                <th> Email </th>
                <th> Senha </th>
                <th> Instagram </th>
                <th> Ativo </th>
                <th> # </th>
            </tr>`;
    for(var i=0;i<tabela.length;i++){
        html += `
            <tr>
                <td>${tabela[i].nome}</td>
                <td>${tabela[i].usuario}</td>
                <td>${tabela[i].email}</td>
                <td>${tabela[i].senha}</td>
                <td>${tabela[i].instagram}</td>
                <td>${tabela[i].ativo}</td>
                <td>
                    <a href='cliente_alterar.html?id=${tabela[i].id}'>Alterar</a>
                    <a href='#' onclick='excluir(${tabela[i].id})'>Excluir</a>
                </td>
            </tr>
        `;
    }
    html += '</table>';
    document.getElementById("lista").innerHTML = html;
}
