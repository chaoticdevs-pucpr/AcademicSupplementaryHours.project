document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ADMIN');
    buscar();
});
document.getElementById("logoff").addEventListener("click", () => {
    logoff();
});

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
        const retorno = await fetch("estudante_get.php");
        const resposta = await retorno.json();
        
        if(resposta.status == "ok" && resposta.data && resposta.data.length > 0){
            preencherTabela(resposta.data);
        } else {
            preencherTabela([]);
        }
    } catch (e) {
        console.error("Erro de conexão com o PHP:", e);
        preencherTabela([]);
    }
}

async function excluir(id){
    if(confirm("Tem certeza que deseja excluir este estudante?")) {
        const retorno = await fetch("estudante_excluir.php?id=" + id);
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
    // Versão simplificada baseada na tabela de coordenadores: Colunas diretas
    var html = `
    <div class="overflow-x-auto shadow-sm ring-1 ring-slate-200 rounded-xl bg-white">
        <table class="w-full text-left border-collapse min-w-[1000px]">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Matrícula</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CPF</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Celular</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Turma / Curso</th>
                    <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">`;

    if (!tabela || tabela.length === 0) {
        html += `
        <tr>
            <td colspan="8" class="py-12 text-center text-slate-500 text-sm italic">
                Nenhum estudante encontrado no sistema.
            </td>
        </tr>`;
    } else {
        for(var i = 0; i < tabela.length; i++){
            const est = tabela[i];
            
            html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-slate-400">${est.id}</td>
                <td class="px-6 py-4 text-sm font-bold text-purple-600 font-mono">${est.matricula_id || '---'}</td>
                <td class="px-6 py-4 text-sm font-semibold text-slate-900">${est.nome}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${est.email}</td>
                <td class="px-6 py-4 text-sm text-slate-600 font-mono">${est.cpf || '---'}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${est.celular || est.telefone || '---'}</td>
                <td class="px-6 py-4">
                    <div class="text-xs font-medium text-slate-700">${est.turma_nome || 'Sem turma'}</div>
                    <div class="text-[10px] text-slate-400 uppercase tracking-tighter">${est.curso_nome || 'Sem curso'}</div>
                </td>
                <td class="px-6 py-4 text-right space-x-3">
                    <a href="estudante_alterar.html?id=${est.id}" class="text-purple-600 hover:text-purple-900 text-sm font-bold transition-colors">
                        Alterar
                    </a>
                    <button onclick="excluir(${est.id})" class="text-red-500 hover:text-red-700 text-sm font-bold transition-colors">
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