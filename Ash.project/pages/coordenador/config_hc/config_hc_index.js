document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('COORDENADOR');
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
    const retorno = await fetch("config_hc_get.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        preencherTabela(resposta.data);
    }
}

async function excluir(id){
    const retorno = await fetch("config_hc_excluir.php?id=" + id);
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
            <th>ID Subcategoria</th>
            <th>Versao</th>
            <th>Data Manual</th>
            <th>Horas Objetivo</th>
            <th>Categoria</th>
            <th>Max Horas Categoria</th>
            <th>Subcategoria</th>
            <th>Horas Subcategoria</th>
            <th>#</th>
        </tr>`;

    for(var i = 0; i < tabela.length; i++){
        const item = tabela[i];
        html += `<tr>
            <td>${item.subcategoria_id}</td>
            <td>${item.versao}</td>
            <td>${item.data_manual}</td>
            <td>${item.horas_objetivo}</td>
            <td>${item.categoria_nome}</td>
            <td>${item.max_horas}</td>
            <td>${item.subcategoria_nome}</td>
            <td>${item.quant_horas}</td>
            <td>
                <a href="config_hc_alterar.html?id=${item.subcategoria_id}">Alterar</a>
                <a href="#" onclick="excluir(${item.subcategoria_id})">Excluir</a>
            </td>
        </tr>`;
    }

    html += `</table>`;
    document.getElementById("lista").innerHTML = html;
}
