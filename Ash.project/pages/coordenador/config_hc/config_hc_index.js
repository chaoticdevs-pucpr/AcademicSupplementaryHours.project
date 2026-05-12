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
        console.error("Erro ao buscar versões:", e);
        preencherTabela([]);
    }
}

async function excluir(id){
    if(confirm("Tem certeza que deseja excluir esta versão do manual?")) {
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
    <div class="overflow-x-auto shadow-sm ring-1 ring-slate-200 rounded-xl bg-white">
        <table class="w-full text-left border-collapse min-w-[800px]">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Versão</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Horas Objetivo</th>
                    <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">`;

    if (!tabela || tabela.length === 0) {
        html += `
        <tr>
            <td colspan="5" class="py-12 text-center text-slate-500 text-sm">
                Nenhuma versão de manual cadastrada.
            </td>
        </tr>`;
    } else {
        for(var i = 0; i < tabela.length; i++){
            const item = tabela[i];
            html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-slate-400">${item.manual_id}</td>
                <td class="px-6 py-4">
                    <div class="text-sm font-bold text-slate-900">${item.versao}</div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-600">${item.data_manual}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${item.horas_objetivo}h</td>
                <td class="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                    <a href="html/config_hc_versao.html?versao=${encodeURIComponent(item.versao)}" class="text-purple-600 hover:text-purple-900 text-sm font-bold transition-colors">Categorias</a>
                    <a href="html/config_hc_alterar.html?id=${item.manual_id}" class="text-slate-600 hover:text-slate-900 text-sm font-bold transition-colors">Alterar</a>
                    <button onclick="excluir(${item.manual_id})" class="text-red-500 hover:text-red-700 text-sm font-bold transition-colors">Excluir</button>
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