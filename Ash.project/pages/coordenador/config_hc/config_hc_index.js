document.addEventListener("DOMContentLoaded", () => {

    valida_sessao('COORDENADOR');

    buscar();

});

const btnLogoff = document.getElementById("logoff");
if(btnLogoff) {
    btnLogoff.addEventListener("click", () => {
        logoff();
    });
}

async function logoff(){
    try {
        const retorno = await fetch("../../../z_login/logoff.php");
        const resposta = await retorno.json();
        if(resposta.status == "ok"){
            window.location.href = "../../../z_login/";
        }
    } catch (e) {
        console.error("Erro no logoff:", e);
    }
}

async function buscar(){
    try {
        const retorno = await fetch("php/config_hc_get.php");
        const resposta = await retorno.json();
        if(resposta.status == "ok" && resposta.data && resposta.data.length > 0){
            preencherTabela(resposta.data);
        } else {
            preencherTabela([]);
        }
    } catch (e) {
        console.error("Erro ao buscar configurações:", e);
        preencherTabela([]);
    }
}

async function excluir(id){
    if(confirm("Tem certeza que deseja excluir esta configuração de subcategoria?")) {
        try {
            const retorno = await fetch("php/config_hc_excluir.php?id=" + id);
            const resposta = await retorno.json();
            if(resposta.status == "ok"){
                alert("SUCESSO: " + resposta.mensagem);
                buscar();
            }else{
                alert("ERRO: " + resposta.mensagem);
            }
        } catch (e) {
            console.error("Erro ao excluir:", e);
            alert("Erro de comunicação com o servidor.");
        }
    }
}

function preencherTabela(tabela){
    var html = `
    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Curso / Manual</th>
                    <th>Categoria (Limite Máx)</th>
                    <th>Subcategoria (Valor)</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>`;

    if (!tabela || tabela.length === 0) {
        html += `
        <tr>
            <td colspan="5">
                Nenhuma configuração de horas complementares cadastrada.
            </td>
        </tr>`;
    } else {
        for(var i = 0; i < tabela.length; i++){
            const item = tabela[i];
            
            html += `
            <tr>
                <td>
                    ${item.subcategoria_id}
                </td>
                <td>
                    <div>${item.curso_nome}</div>
                    <div>
                        <span>${item.versao}</span> • ${item.data_manual} • Meta: ${item.horas_objetivo}h
                    </div>
                </td>
                <td>
                    <div>${item.categoria_nome}</div>
                    <div>Máximo: <span>${item.max_horas}h</span></div>
                </td>
                <td>
                    <div>${item.subcategoria_nome}</div>
                    <div>Equivale a: <span>${item.quant_horas}h</span></div>
                </td>
                <td>
                    <a href="html/config_hc_alterar.html?id=${item.subcategoria_id}">
                        Alterar
                    </a>
                    <button onclick="excluir(${item.subcategoria_id})">
                        Excluir
                    </button>
                </td>
            </tr>`;
        }
    }

    html += `</tbody></table></div>`;
    
    const container = document.getElementById("lista");
    if(container) {
        container.innerHTML = html;
    }
}