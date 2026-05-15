document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('PROFESSOR');

    const url = new URLSearchParams(window.location.search);
    const turma = url.get('turma_id');
    if(!turma){
        alert('Turma não informada.');
        window.location.href = 'index.html';
        return;
    }

    buscar(turma);

    const selectSituacao = document.getElementById('situacao');
    if (selectSituacao) {
        selectSituacao.addEventListener('change', () => buscar(turma));
    }

    const btnLogoff = document.getElementById('logoff');
    if(btnLogoff){
        btnLogoff.addEventListener('click', () => { logoff(); });
    }
});

async function logoff(){
    try {
        const retorno = await fetch("../../../z_login/logoff.php");
        const resposta = await retorno.json();
        if(resposta.status == 'ok'){
            window.location.href = "../../../z_login/";
        }
    } catch(e) {
        console.error('Erro no logoff:', e);
    }
}

async function buscar(turma){
    const select = document.getElementById('situacao');
    const situacao = select ? select.value : '';
    const statusMap = {
        pendentes: 'PENDENTE',
        aprovadas: 'APROVADO',
        rejeitadas: 'RECUSADO'
    };
    const status = statusMap[situacao] || '';
    try {
        const retorno = await fetch(`php/turmas_detalhes_get.php?turma=${encodeURIComponent(turma)}&status=${encodeURIComponent(status)}`);
        const resposta = await retorno.json();
        if(resposta.status == 'ok'){
            preencherTabela(resposta.data, turma);
        } else {
            preencherTabela([], turma);
        }
    } catch (e) {
        console.error('Erro ao buscar solicitações:', e);
        preencherTabela([], turma);
    }
}

function preencherTabela(tabela, turma){
    let html = `
    <div class="overflow-x-auto shadow-sm ring-1 ring-slate-200 rounded-xl bg-white">
        <table class="w-full text-left border-collapse min-w-[800px]">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aluno</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data da Solicitação</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">`;

    if(!tabela || tabela.length === 0){
        html += `
        <tr>
            <td colspan="4" class="py-12 text-center text-slate-500 text-sm">
                Nenhuma solicitação encontrada para esta turma.
            </td>
        </tr>`;
    } else {
        for(const item of tabela){
            html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm text-slate-900">${item.id}</td>
                <td class="px-6 py-4 text-sm text-slate-900">${item.aluno}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${item.data_envio}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${item.status}</td>
                <td class="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                    <a href="turma_solicitacao.html?solicitacao_id=${item.id}" class="text-purple-600 hover:text-purple-900 text-sm font-bold transition-colors">Selecionar</a>
                </td>
            </tr>`;
       }
    }

    html += `</tbody></table></div>`;
    document.getElementById('lista').innerHTML = html;
}
