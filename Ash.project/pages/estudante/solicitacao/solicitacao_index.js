document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ESTUDANTE');
    buscar();
});


const btnLogoff = document.getElementById("logoff");
if (btnLogoff) {
    btnLogoff.addEventListener("click", () => {
        logoff();
    });
}

async function logoff() {
    try {
        const retorno = await fetch("../../../z_login/logoff.php");
        const resposta = await retorno.json();
        if (resposta.status == "ok") {
            window.location.href = "../../../z_login/";
        }
    } catch (e) {
        console.error("Erro no logoff:", e);
    }
}

async function buscar() {
    try {
        const retorno = await fetch("solicitacao_get.php");
        const resposta = await retorno.json();
        
        if (resposta.status == "ok" && resposta.data && resposta.data.length > 0) {
            preencherTabela(resposta.data);
        } else {
            preencherTabela([]);
        }
    } catch (e) {
        console.error("Erro ao buscar solicitações:", e);
        preencherTabela([]);
    }
}

async function excluir(id) {
    if (confirm("Tem certeza que deseja excluir esta solicitação de horas?")) {
        try {
            const retorno = await fetch("solicitacao_excluir.php?id=" + id);
            const resposta = await retorno.json();
            if (resposta.status == "ok") {
                alert("SUCESSO: " + resposta.mensagem);
                buscar();
            } else {
                alert("ERRO: " + resposta.mensagem);
            }
        } catch (e) {
            console.error("Erro ao excluir solicitação:", e);
            alert("Erro de comunicação com o servidor.");
        }
    }
}

function preencherTabela(tabela) {
    // Estilo de tabela limpo, focado na leitura clara dos dados
    var html = `
    <div class="overflow-x-auto shadow-sm ring-1 ring-slate-200 rounded-xl bg-white">
        <table class="w-full text-left border-collapse min-w-[1000px]">
            <thead class="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                    <th class="px-6 py-4">ID</th>
                    <th class="px-6 py-4">Categoria</th>
                    <th class="px-6 py-4">Subcategoria</th>
                    <th class="px-6 py-4 text-center">Horas Brutas</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4">Data de Envio</th>
                    <th class="px-6 py-4">Anexo</th>
                    <th class="px-6 py-4 text-right">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">`;

    if (!tabela || tabela.length === 0) {
        html += `
        <tr>
            <td colspan="8" class="py-12 text-center text-slate-500 text-sm">
                Ainda não enviou nenhuma solicitação de horas complementares.
            </td>
        </tr>`;
    } else {
        for (var i = 0; i < tabela.length; i++) {
            const item = tabela[i];
            
            // Lógica para criar um Badge colorido dependendo do Status
            let statusBadge = '';
            let s = item.status ? item.status.toUpperCase() : '';
            
            if (s === 'PENDENTE') {
                statusBadge = `<span class="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">${item.status}</span>`;
            } else if (s === 'APROVADO' || s === 'DEFERIDO' || s === 'DEFERIDA') {
                statusBadge = `<span class="bg-green-100 text-green-800 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">${item.status}</span>`;
            } else if (s === 'REJEITADO' || s === 'INDEFERIDO' || s === 'INDEFERIDA' || s === 'RECUSADO') {
                statusBadge = `<span class="bg-red-100 text-red-800 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">${item.status}</span>`;
            } else {
                statusBadge = `<span class="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">${item.status || '---'}</span>`;
            }

            // Anexo com ícone bonitinho (SVG do Lucide incorporado)
            const anexo = item.caminho_arquivo && item.caminho_arquivo !== "null"
                ? `<a href="../../../${item.caminho_arquivo}" target="_blank" class="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-800 font-semibold transition-colors text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                    Arquivo
                   </a>` 
                : `<span class="text-slate-400 text-sm italic">Sem anexo</span>`;

            // Proteção contra datas "null" do banco
            const dataEnvio = (item.data_envio && item.data_envio !== "null") ? item.data_envio : '---';

            html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-slate-400">${item.id}</td>
                <td class="px-6 py-4 text-sm font-bold text-slate-900">${item.categoria_nome || '---'}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${item.subcategoria_nome || '---'}</td>
                <td class="px-6 py-4 text-sm font-bold text-slate-700 text-center">${item.horas_brutas || '0'}h</td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4 text-sm text-slate-500">${dataEnvio}</td>
                <td class="px-6 py-4">${anexo}</td>
                <td class="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                    <a href="solicitacao_alterar.html?id=${item.id}" class="text-purple-600 hover:text-purple-900 text-sm font-bold transition-colors">
                        Alterar
                    </a>
                    <button onclick="excluir(${item.id})" class="text-red-500 hover:text-red-700 text-sm font-bold transition-colors">
                        Excluir
                    </button>
                </td>
            </tr>`;
        }
    }

    html += `</tbody></table></div>`;
    
    // Injeção segura da tabela no HTML
    const container = document.getElementById("lista");
    if(container) {
        container.innerHTML = html;
    } else {
        console.error("Contentor com ID 'lista' não encontrado no HTML.");
    }
}