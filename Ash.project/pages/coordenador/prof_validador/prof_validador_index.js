document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('COORDENADOR');
    buscar();
});


const btnLogoff = document.getElementById("logoff");
if (btnLogoff) {
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
        const retorno = await fetch("php/prof_validador_get.php");
        const resposta = await retorno.json();
        if(resposta.status == "ok" && resposta.data && resposta.data.length > 0){
            preencherTabela(resposta.data);
        } else {
            preencherTabela([]);
        }
    } catch (e) {
        console.error("Erro ao buscar professores:", e);
        preencherTabela([]);
    }
}

async function excluir(id){
    if(confirm("Tem certeza que deseja remover este professor da lista de validadores?")) {
        try {
            const retorno = await fetch("php/prof_validador_excluir.php?id=" + id);
            const resposta = await retorno.json();
            if(resposta.status == "ok"){
                alert("SUCESSO: " + resposta.mensagem);
                buscar();
            } else {
                alert("ERRO: " + resposta.mensagem);
            }
        } catch (e) {
            console.error("Erro ao excluir professor:", e);
            alert("Erro de comunicação com o servidor.");
        }
    }
}

function preencherTabela(tabela){
    var html = `
    <div class="overflow-x-auto shadow-sm ring-1 ring-slate-200 rounded-xl bg-white">
        <table class="w-full text-left border-collapse min-w-[900px]">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome / E-mail</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CPF / Contato</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Turma / Curso</th>
                    <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">`;

    if (!tabela || tabela.length === 0) {
        html += `
        <tr>
            <td colspan="5" class="py-12 text-center text-slate-500 text-sm">
                Nenhum professor validador encontrado no sistema.
            </td>
        </tr>`;
    } else {
        for(var i = 0; i < tabela.length; i++){
            const prof = tabela[i];
            
            // Tratamento de contatos para evitar erros
            let contato = prof.celular ? prof.celular : (prof.telefone ? prof.telefone : '---');

            html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-slate-400">${prof.id}</td>
                <td class="px-6 py-4">
                    <div class="text-sm font-semibold text-slate-900">${prof.nome}</div>
                    <div class="text-xs text-slate-500">${prof.email}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-xs text-slate-600 font-medium">CPF: ${prof.cpf || '---'}</div>
                    <div class="text-xs text-slate-400 mt-0.5">Cont: ${contato}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-xs font-medium text-slate-700">${prof.turma_nome || 'Sem turma'}</div>
                    <div class="text-[10px] text-slate-400 uppercase tracking-tighter">${prof.curso_nome || 'Sem curso'}</div>
                </td>
                <td class="px-6 py-4 text-right space-x-3">
                    <a href="html/prof_validador_alterar.html?id=${prof.id}" class="text-purple-600 hover:text-purple-900 text-sm font-bold transition-colors">
                        Alterar
                    </a>
                    <button onclick="excluir(${prof.id})" class="text-red-500 hover:text-red-700 text-sm font-bold transition-colors">
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