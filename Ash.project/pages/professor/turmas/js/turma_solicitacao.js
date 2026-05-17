let destinoDetalhes = 'detalhes.html';

document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('PROFESSOR');

    const url = new URLSearchParams(window.location.search);
    const solicitacaoId = url.get('solicitacao_id');
    const turmaId = url.get('turma_id');
    destinoDetalhes = turmaId ? `detalhes.html?turma_id=${encodeURIComponent(turmaId)}` : 'detalhes.html';

    const linkVoltar = document.getElementById('voltar-lista');
    if (linkVoltar) {
        linkVoltar.href = destinoDetalhes;
    }

    if (!solicitacaoId) {
        alert('Solicitação não informada.');
        window.location.href = destinoDetalhes;
        return;
    }

    carregarSolicitacao(solicitacaoId);

    const btnLogoff = document.getElementById('logoff');
    if (btnLogoff) {
        btnLogoff.addEventListener('click', () => logoff());
    }

    const btnAprovar = document.getElementById('btn-aprovar');
    if (btnAprovar) {
        btnAprovar.addEventListener('click', () => decidir(solicitacaoId, 'APROVAR'));
    }

    const btnRecusar = document.getElementById('btn-recusar');
    if (btnRecusar) {
        btnRecusar.addEventListener('click', () => decidir(solicitacaoId, 'RECUSAR'));
    }
});

async function logoff() {
    try {
        const retorno = await fetch("../../../z_login/logoff.php");
        const resposta = await retorno.json();
        if (resposta.status === 'ok') {
            window.location.href = "../../../z_login/";
        }
    } catch (e) {
        console.error('Erro no logoff:', e);
    }
}

async function carregarSolicitacao(solicitacaoId) {
    try {
        const retorno = await fetch(`php/turma_solicitacao_get.php?id=${encodeURIComponent(solicitacaoId)}`);
        const resposta = await retorno.json();

        if (resposta.status === 'ok' && resposta.data) {
            preencherTela(resposta.data);
        } else {
            alert(resposta.mensagem || 'Não foi possível carregar a solicitação.');
            window.location.href = destinoDetalhes;
        }
    } catch (e) {
        console.error('Erro ao carregar solicitação:', e);
        alert('Erro de comunicação com o servidor.');
        window.location.href = destinoDetalhes;
    }
}

function preencherTela(item) {
    document.getElementById('titulo-solicitacao').textContent = `#${item.id}`;
    document.getElementById('badge-status').textContent = item.status || '---';
    document.getElementById('badge-status').className = `inline-flex items-center rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusClasses(item.status)}`;

    document.getElementById('aluno-nome').textContent = item.aluno_nome || '---';
    document.getElementById('aluno-email').textContent = item.aluno_email || '---';
    document.getElementById('turma-nome').textContent = item.turma_nome || '---';
    document.getElementById('curso-nome').textContent = item.curso_nome || '---';
    document.getElementById('categoria-nome').textContent = item.categoria_nome || '---';
    document.getElementById('subcategoria-nome').textContent = item.subcategoria_nome || '---';
    document.getElementById('horas-brutas').textContent = formatHoras(item.horas_brutas);
    document.getElementById('pontos-validados').textContent = formatHoras(item.pontos_validados);
    document.getElementById('data-envio').textContent = item.data_envios || '---';
    document.getElementById('justificativa-estudante').value = item.justificativa || '';

    const pontosInput = document.getElementById('pontos-validados-input');
    if (pontosInput) {
        const sugestao = item.subcategoria_pontos ?? item.pontos_validados ?? item.horas_brutas ?? 0;
        pontosInput.value = formatHoras(sugestao);
        pontosInput.max = item.subcategoria_pontos ?? '';
    }

    const anexosLista = document.getElementById('anexos-lista');
    const semAnexo = document.getElementById('sem-anexo');
    const anexos = Array.isArray(item.anexos) ? item.anexos : [];
    if (anexosLista) {
        anexosLista.innerHTML = '';
    }
    if (anexos.length > 0) {
        if (anexosLista) {
            anexos.forEach((anexo, indice) => {
                const link = document.createElement('a');
                link.href = `../../${anexo.caminho_arquivo}`;
                link.target = '_blank';
                link.className = 'inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold transition-colors';
                link.innerHTML = `<i data-lucide="paperclip" class="w-4 h-4"></i> Anexo ${indice + 1}`;
                anexosLista.appendChild(link);
            });
        }
        semAnexo.classList.add('hidden');
    } else {
        semAnexo.classList.remove('hidden');
    }

    const podeDecidir = !item.status || item.status.toUpperCase() === 'PENDENTE';
    document.getElementById('btn-aprovar').disabled = !podeDecidir;
    document.getElementById('btn-recusar').disabled = !podeDecidir;

    if (!podeDecidir) {
        document.getElementById('btn-aprovar').classList.add('opacity-60', 'cursor-not-allowed');
        document.getElementById('btn-recusar').classList.add('opacity-60', 'cursor-not-allowed');
        document.getElementById('justificativa-recusa').disabled = true;
    }

    document.getElementById('carregando').classList.add('hidden');
    document.getElementById('conteudo').classList.remove('hidden');
    if (window.lucide) {
        lucide.createIcons();
    }
}

function statusClasses(status) {
    const valor = (status || '').toUpperCase();
    if (valor === 'PENDENTE') return 'bg-amber-100 text-amber-800';
    if (valor === 'APROVADO') return 'bg-emerald-100 text-emerald-800';
    if (valor === 'RECUSADO') return 'bg-rose-100 text-rose-800';
    return 'bg-slate-100 text-slate-700';
}

function formatHoras(valor) {
    const numero = Number(valor);
    if (Number.isNaN(numero)) {
        return '0';
    }
    return numero.toFixed(2).replace(/\.00$/, '');
}

async function decidir(solicitacaoId, acao) {
    const pontosValidadosInput = document.getElementById('pontos-validados-input');
    const justificativaRecusa = document.getElementById('justificativa-recusa').value.trim();

    if (acao === 'RECUSAR' && justificativaRecusa === '') {
        alert('Informe uma justificativa para a recusa.');
        return;
    }

    const pontosValidados = pontosValidadosInput ? parseFloat(pontosValidadosInput.value) : NaN;

    if (acao === 'APROVAR' && (Number.isNaN(pontosValidados) || pontosValidados <= 0)) {
        alert('Informe os pontos validados para aprovar a solicitação.');
        return;
    }

    const confirmacao = acao === 'APROVAR'
        ? 'Confirma a aprovação desta solicitação?'
        : 'Confirma a recusa desta solicitação?';

    if (!confirm(confirmacao)) {
        return;
    }

    try {
        const formData = new FormData();
        formData.append('acao', acao);
        formData.append('pontos_validados', Number.isNaN(pontosValidados) ? '' : String(pontosValidados));
        formData.append('justificativa_recusa', justificativaRecusa);

        const retorno = await fetch(`php/turma_solicitacao_salvar.php?id=${encodeURIComponent(solicitacaoId)}`, {
            method: 'POST',
            body: formData
        });
        const resposta = await retorno.json();

        if (resposta.status === 'ok') {
            alert(resposta.mensagem);
            window.location.href = destinoDetalhes;
        } else {
            alert(resposta.mensagem || 'Não foi possível processar a solicitação.');
        }
    } catch (e) {
        console.error('Erro ao salvar decisão:', e);
        alert('Erro de comunicação com o servidor.');
    }
}