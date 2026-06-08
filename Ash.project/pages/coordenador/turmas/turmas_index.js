let turmasCompletas = [];

document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('COORDENADOR');
    const filtroNome = document.getElementById('filtro_nome');

    if (filtroNome) {
        filtroNome.addEventListener('input', aplicarFiltros);
    }

    carregarTurmas();

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





function carregarTurmas() {
    const listaContainer = document.getElementById('lista');

    fetch('php/turmas_curso.php')
        .then(response => response.json())
        .then(json => {
            if (!json || json.status !== 'ok' || !Array.isArray(json.data)) {
                listaContainer.innerHTML = `
                    <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-500">
                        Nenhuma turma encontrada para o seu curso.
                    </div>`;
                return;
            }

            turmasCompletas = json.data;
            aplicarFiltros();
        })
        .catch(error => {
            console.error("Erro ao carregar as turmas:", error);
            listaContainer.innerHTML = `
                <div class="rounded-2xl border border-red-200 bg-red-50 px-6 py-6 text-center text-red-600 font-medium">
                    Erro ao carregar as turmas. Tente novamente.
                </div>`;
        });
}

function aplicarFiltros() {
    const filtroNome = document.getElementById('filtro_nome');
    const listaContainer = document.getElementById('lista');

    const termoNome = filtroNome ? filtroNome.value.trim().toLowerCase() : '';

    const turmasFiltradas = turmasCompletas.filter(turma => {
        const nome = (turma.nome || turma.nome_turma || '').toString().toLowerCase();
        const matchNome = !termoNome || nome.includes(termoNome);
        return matchNome;
    });

    renderTurmas(turmasFiltradas, listaContainer);
}

function renderTurmas(turmas, listaContainer) {
    if (!Array.isArray(turmas) || turmas.length === 0) {
        listaContainer.innerHTML = `
            <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-500">
                Nenhuma turma encontrada com o filtro atual.
            </div>`;
        return;
    }

    let htmlCards = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">';

    turmas.forEach(turma => {
        const nome = turma.nome || turma.nome_turma || 'Turma';
        const semestre = turma.semestre !== undefined ? ` - ${escapeHtml(String(turma.semestre))}º semestre` : '';

        htmlCards += `
            <button data-turma-id="${turma.id}" data-turma-nome="${escapeHtml(nome)}" type="button" class="w-full text-left bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:border-cyan-500 hover:shadow-md transition-all cursor-pointer group">
                <div class="flex items-start justify-between">
                    <div>
                        <h3 class="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">${escapeHtml(nome)}</h3>
                        <p class="text-sm text-slate-500 mt-1">ID ${escapeHtml(String(turma.id))}${semestre}</p>
                    </div>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors"></i>
                </div>
            </button>
        `;
    });

    htmlCards += '</div>';
    listaContainer.innerHTML = htmlCards;
    lucide.createIcons();

    listaContainer.querySelectorAll('[data-turma-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-turma-id');
            const nome = btn.getAttribute('data-turma-nome') || '';
            abrirModalTurma(id, nome);
        });
    });
}

// Função que será chamada quando o coordenador clicar no card
// Sanitização mínima para inserir texto seguro em HTML
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function abrirModalTurma(turmaId, turmaNome) {
    if (!document.getElementById('turma_modal')) {
        const modalHtml = `
        <div id="turma_modal" class="fixed inset-0 z-50 hidden items-center justify-center">
            <div class="absolute inset-0 bg-black/40" id="turma_modal_overlay"></div>
            <div class="relative bg-white rounded-2xl shadow-lg max-w-5xl w-full mx-4 overflow-hidden h-[32rem]">
                <div class="px-6 pt-10 pb-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 id="turma_modal_title" class="text-lg font-bold text-slate-900">Turma</h3>
                    <button id="turma_modal_close" class="text-slate-500 hover:text-slate-800">Fechar</button>
                </div>
                <div class="p-6 flex flex-col h-[calc(100%-64px)]" id="turma_modal_body">
                    <div id="turma_modal_summary" class="flex justify-center mt-4 mb-4"></div>
                    <div id="turma_modal_loading" class="text-sm text-slate-500 text-center">Carregando alunos...</div>
                    <div id="turma_modal_content" class="mt-4 overflow-auto"></div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('turma_modal_overlay').addEventListener('click', closeModal);
        document.getElementById('turma_modal_close').addEventListener('click', closeModal);
    }

    const modal = document.getElementById('turma_modal');
    const title = document.getElementById('turma_modal_title');
    const loading = document.getElementById('turma_modal_loading');
    const content = document.getElementById('turma_modal_content');
    const summary = document.getElementById('turma_modal_summary');

    title.textContent = turmaNome || `Turma ${turmaId}`;
    loading.style.display = 'block';
    content.innerHTML = '';
    summary.innerHTML = '';
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // busca alunos
    fetch(`php/turmas_alunos.php?turma_id=${encodeURIComponent(turmaId)}`)
        .then(r => r.json())
        .then(json => {
            loading.style.display = 'none';
            if (!json || json.status !== 'ok' || !Array.isArray(json.data) || json.data.length === 0) {
                content.innerHTML = `<div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-6 text-center text-slate-500">Nenhum aluno encontrado.</div>`;
                return;
            }

            const metaHorasRaw = parseFloat(json.horas_objetivo);
            const metaHoras = Number.isFinite(metaHorasRaw) && metaHorasRaw > 0 ? metaHorasRaw : 0;
            let completaram = 0;
            json.data.forEach(a => {
                if (metaHoras > 0 && (parseFloat(a.total_pontos || 0)) >= metaHoras) {
                    completaram += 1;
                }
            });
            const totalAlunos = json.data.length;
            const porcentagem = totalAlunos > 0 ? (completaram / totalAlunos) * 100 : 0;

            const resumoMeta = metaHoras > 0 ? `Meta: ${metaHoras.toFixed(0)}h` : 'Meta de horas indisponível';
            const somaHtml = `
                <div class="flex flex-col items-center justify-center gap-2 text-center">
                    <div class="w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-700 text-xl font-bold">${metaHoras > 0 ? porcentagem.toFixed(0) : '—'}%</div>
                    <div class="text-sm text-slate-500">Alunos completos</div>
                    <div class="text-sm text-slate-500">${completaram} de ${totalAlunos}</div>
                    <div class="text-sm text-slate-500">${resumoMeta}</div>
                </div>`;

            const totalSolicitacoes = parseInt(json.total_solicitacoes || 0, 10);
            const infoMessage = totalSolicitacoes === 0 ? `
                <div class="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-900 mb-4">
                    Ainda não foram enviadas ou validadas solicitações de horas complementares para esta turma. Os indicadores abaixo refletem o desempenho atual como zero.
                </div>` : '';

            summary.innerHTML = somaHtml + infoMessage;

            // monta tabela com 4 colunas: Nome, Matrícula, Horas, Status
            let table = `
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[600px]">
                        <thead class="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th class="px-4 py-2 text-xs font-bold text-slate-500 uppercase">Nome</th>
                                <th class="px-4 py-2 text-xs font-bold text-slate-500 uppercase">Matrícula</th>
                                <th class="px-4 py-2 text-xs font-bold text-slate-500 uppercase">Horas</th>
                                <th class="px-4 py-2 text-xs font-bold text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-slate-200">`;

            json.data.forEach(aluno => {
                const horasAlunoValue = parseFloat(aluno.total_pontos || 0);
                const horasAluno = horasAlunoValue.toFixed(2);
                const statusTexto = metaHoras > 0
                    ? (horasAlunoValue >= metaHoras ? 'Completo' : 'Em progresso')
                    : 'Meta indisponível';
                const limiteTexto = metaHoras > 0 ? `${metaHoras.toFixed(0)}h` : 'N/D';

                table += `
                    <tr>
                        <td class="px-4 py-3 text-sm font-semibold text-slate-900">
                            <div class="flex items-center justify-between gap-3">
                                <div>
                                    ${escapeHtml(aluno.nome || '---')}
                                    <div class="text-xs text-slate-500 mt-1">${horasAluno}h / ${limiteTexto}</div>
                                </div>
                                <button type="button" data-matricula-id="${escapeHtml(aluno.matricula_id || '')}" class="px-2 py-1 rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 aluno-detalhes-btn">Ver detalhes</button>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-sm font-mono text-cyan-600">${escapeHtml(aluno.matricula_id || '---')}</td>
                        <td class="px-4 py-3 text-sm font-semibold text-cyan-600">${horasAluno}</td>
                        <td class="px-4 py-3 text-sm font-medium text-slate-700">${escapeHtml(statusTexto)}</td>
                    </tr>`;
            });

            table += `</tbody></table></div>`;
            content.innerHTML = table;
            content.querySelectorAll('.aluno-detalhes-btn').forEach(btn => {
                btn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const matriculaId = btn.getAttribute('data-matricula-id');
                    const nomeAluno = btn.closest('tr')?.querySelector('td:first-child div > div')?.textContent?.trim() || '';
                    abrirModalAlunoDetalhes(matriculaId, nomeAluno);
                });
            });
        })
        .catch(err => {
            loading.style.display = 'none';
            content.innerHTML = `<div class="rounded-2xl border border-red-200 bg-red-50 px-6 py-6 text-center text-red-600">Erro ao carregar alunos.</div>`;
            console.error('Erro ao carregar alunos:', err);
        });
}

function abrirModalAlunoDetalhes(matriculaId, nomeAluno) {
    if (!matriculaId) return;

    let modal = document.getElementById('aluno_modal');
    if (!modal) {
        const novoModal = document.createElement('div');
        novoModal.id = 'aluno_modal';
        novoModal.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/50 p-4';
        novoModal.innerHTML = `
            <div class="max-w-3xl w-full rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200">
                <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                        <h2 id="aluno_modal_title" class="text-lg font-semibold text-slate-900">Detalhes do aluno</h2>
                        <p class="text-sm text-slate-500">Histórico de categorias e subcategorias de horas complementares.</p>
                    </div>
                    <button type="button" id="aluno_modal_close" class="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-200">Fechar</button>
                </div>
                <div id="aluno_modal_loading" class="mt-6 text-sm text-slate-500">Carregando detalhes...</div>
                <div id="aluno_modal_content" class="mt-4 space-y-3 max-h-[26rem] overflow-auto"></div>
            </div>`;
        document.body.appendChild(novoModal);
        modal = novoModal;

        novoModal.addEventListener('click', (event) => {
            if (event.target === novoModal) {
                novoModal.classList.remove('flex');
                novoModal.classList.add('hidden');
            }
        });
        novoModal.querySelector('#aluno_modal_close').addEventListener('click', () => {
            novoModal.classList.remove('flex');
            novoModal.classList.add('hidden');
        });
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const title = modal.querySelector('#aluno_modal_title');
    const loading = modal.querySelector('#aluno_modal_loading');
    const content = modal.querySelector('#aluno_modal_content');

    title.textContent = nomeAluno ? `Detalhes de ${nomeAluno}` : 'Detalhes do aluno';
    loading.style.display = 'block';
    content.innerHTML = '';

    fetch(`php/aluno_detalhes.php?matricula_id=${encodeURIComponent(matriculaId)}`)
        .then(response => response.json())
        .then(json => {
            loading.style.display = 'none';
            if (!json || json.status !== 'ok' || !json.data || !Array.isArray(json.data.detalhes) || json.data.detalhes.length === 0) {
                content.innerHTML = `<div class="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-6 text-center text-slate-600">Nenhuma hora complementar encontrada para este aluno.</div>`;
                return;
            }

            const detalhes = json.data.detalhes.map(item => `
                <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div class="flex items-center justify-between gap-3">
                        <div>
                            <div class="text-sm font-semibold text-slate-900">${escapeHtml(item.categoria_nome)}</div>
                            <div class="text-xs text-slate-500 mt-1">${escapeHtml(item.subcategoria_nome)}</div>
                        </div>
                        <div class="text-sm font-semibold text-cyan-700">${parseFloat(item.horas_aprovadas || 0).toFixed(2)}h</div>
                    </div>
                    <div class="mt-3 text-xs text-slate-500">
                        Tipo: ${escapeHtml(item.tipo_calculo || 'N/D')} • Aprovado: ${parseFloat(item.horas_aprovadas || 0).toFixed(2)}h • Pendente: ${parseFloat(item.horas_pendentes || 0).toFixed(2)}h
                    </div>
                </div>`).join('');

            content.innerHTML = `<div class="grid gap-3">${detalhes}</div>`;
        })
        .catch(err => {
            loading.style.display = 'none';
            content.innerHTML = `<div class="rounded-2xl border border-red-200 bg-red-50 px-6 py-6 text-center text-red-600">Erro ao carregar os detalhes do aluno.</div>`;
            console.error('Erro ao carregar detalhes do aluno:', err);
        });
}

function closeModal() {
    const modal = document.getElementById('turma_modal');
    if (!modal) return;
    modal.classList.remove('flex');
    modal.classList.add('hidden');
}
