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
        <table class="w-full text-left border-collapse min-w-[760px] text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th class="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aluno</th>
                    <th class="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data da Solicitação</th>
                    <th class="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Certificado</th>
                    <th class="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th class="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">`;

    if(!tabela || tabela.length === 0){
        html += `
        <tr>
            <td colspan="6" class="py-12 text-center text-slate-500 text-sm">
                Nenhuma solicitação encontrada para esta turma.
            </td>
        </tr>`;
    } else {
        for(const item of tabela){
            const anexos = Array.isArray(item.anexos) ? item.anexos : [];
            let certificadoHtml = '';
            if (anexos.length > 0) {
                certificadoHtml = '<div class="flex flex-col gap-2">';
                anexos.forEach(anexoItem => {
                    const fileName = anexoItem.caminho_arquivo.split('/').pop();
                    const ext = fileName.split('.').pop().toLowerCase();
                    let mimeType = 'application/octet-stream';
                    if (['jpg','jpeg','png','gif','webp','bmp','svg'].includes(ext)) {
                        mimeType = 'image/' + (ext === 'jpg' ? 'jpeg' : ext);
                    } else if (ext === 'pdf') {
                        mimeType = 'application/pdf';
                    }
                    const fileUrl = 'php/arquivo_serve.php?anexo_id=' + anexoItem.id;
                    certificadoHtml += `
                        <a href="javascript:void(0)" onclick="openFileViewer('${fileUrl}', '${String(fileName).replace(/'/g, "\\'")}', '${mimeType}')" class="text-purple-600 hover:text-purple-900 text-sm font-semibold transition-colors">
                            ${fileName}
                        </a>`;
                });
                certificadoHtml += '</div>';
            } else {
                certificadoHtml = '<span class="text-slate-400 italic text-sm">Sem certificado</span>';
            }

            html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-900">${item.id}</td>
                <td class="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-900 break-words">${item.aluno}</td>
                <td class="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-600">${item.data_envio}</td>
                <td class="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-900 break-words">${certificadoHtml}</td>
                <td class="px-4 py-3 sm:px-6 sm:py-4">
                    <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeClasses(item.status)}">${item.status}</span>
                </td>
                <td class="px-4 py-3 sm:px-6 sm:py-4 text-right space-x-3 whitespace-nowrap">
                    <a href="turma_solicitacao.html?solicitacao_id=${item.id}&turma_id=${encodeURIComponent(turma)}" class="text-purple-600 hover:text-purple-900 text-sm font-bold transition-colors">Visualizar</a>
                    ${item.status && item.status.toUpperCase() !== 'PENDENTE' ? `<a href="turma_solicitacao.html?solicitacao_id=${item.id}&turma_id=${encodeURIComponent(turma)}" class="text-indigo-600 hover:text-indigo-900 text-sm font-semibold transition-colors">Alterar validação</a>` : ''}
                </td>
            </tr>`;
       }
    }

    html += `</tbody></table></div>`;
    document.getElementById('lista').innerHTML = html;
    if (window.lucide) {
        lucide.createIcons();
    }
}

function statusBadgeClasses(status) {
    const valor = (status || '').toUpperCase();
    if (valor === 'PENDENTE') return 'bg-amber-100 text-amber-800';
    if (valor === 'APROVADO') return 'bg-emerald-100 text-emerald-800';
    if (valor === 'RECUSADO') return 'bg-rose-100 text-rose-800';
    return 'bg-slate-100 text-slate-700';
}
