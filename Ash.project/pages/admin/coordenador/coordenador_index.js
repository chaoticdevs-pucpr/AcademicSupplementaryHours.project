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
    const retorno = await fetch("coordenador_get.php");
    const resposta = await retorno.json();

    if(resposta.status == "ok" && resposta.data && resposta.data.length > 0){
        preencherTabela(resposta.data);
    }else{
        preencherTabela([]);
    }
}

async function excluir(id){
    if(confirm("Tem certeza que deseja excluir este coordenador?")) {
        const retorno = await fetch("coordenador_excluir.php?id=" + id);
        const resposta = await retorno.json();
        if(resposta.status == "ok"){
            alert(resposta.mensagem);
            buscar();
        } else {
            alert(resposta.mensagem);
        }
    }
}

function preencherTabela(tabela){
    // Versão simplificada: Colunas diretas, sem avatares ou agrupamentos complexos
    var html = `
    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CPF</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Celular</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Curso</th>
                    <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">`;

    if (!tabela || tabela.length === 0) {
        html += `
        <tr>
            <td colspan="7" class="py-12 text-center text-slate-500 text-sm">
                Nenhum coordenador encontrado no sistema.
            </td>
        </tr>`;
    } else {
        for(var i = 0; i < tabela.length; i++){
            const coord = tabela[i];
            
            html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-slate-400">${coord.id}</td>
                <td class="px-6 py-4 text-sm font-semibold text-slate-900">${coord.nome}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${coord.email}</td>
                <td class="px-6 py-4 text-sm text-slate-600 font-mono">${coord.cpf || '---'}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${coord.celular || '---'}</td>
                <td class="px-6 py-4">
                    <span class="text-xs font-medium text-slate-700">${coord.curso_nome || 'Não vinculado'}</span>
                </td>
                <td class="px-6 py-4 text-right space-x-3">
                    <a href="coordenador_alterar.html?id=${coord.id}" class="text-purple-600 hover:text-purple-900 text-sm font-bold transition-colors">
                        Alterar
                    </a>
                    <button onclick="excluir(${coord.id})" class="text-red-500 hover:text-red-700 text-sm font-bold transition-colors">
                        Excluir
                    </button>
                </td>
            </tr>`;
        }
    }

    html += `</tbody></table></div>`;
    document.getElementById("lista").innerHTML = html;
}