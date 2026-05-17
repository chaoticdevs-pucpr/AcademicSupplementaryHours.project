document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('COORDENADOR');
    carregarTurmas();
});

const btnLogoff = document.getElementById("logoff");
if (btnLogoff) {
    btnLogoff.addEventListener("click", () => {
        logoff();
    });
}

const selectTurma = document.getElementById("turma_id");
if (selectTurma) {
    selectTurma.addEventListener("change", (evento) => {
        const turmaId = evento.target.value;
        if (turmaId) {
            carregarAlunos(turmaId);
        } else {
            document.getElementById("turma_descricao").textContent = "Selecione uma turma para carregar os dados.";
            preencherTabela([]);
        }
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

async function carregarTurmas(){
    try {
        const retorno = await fetch("php/turmas_curso.php");
        const resposta = await retorno.json();

        if (resposta.status == "ok" && resposta.data && resposta.data.length > 0) {
            const turmaIdPadrao = preencherSelectTurmas(resposta.data);
            document.getElementById("curso_nome").textContent = resposta.curso_nome || resposta.data[0].curso_nome || "Sem curso";
            if (turmaIdPadrao) {
                carregarAlunos(turmaIdPadrao);
            }
        } else {
            document.getElementById("curso_nome").textContent = resposta.curso_nome || "Sem curso";
            if (selectTurma) {
                selectTurma.innerHTML = '<option value="">Nenhuma turma encontrada</option>';
            }
            preencherTabela([]);
        }
    } catch (e) {
        console.error("Erro ao carregar turmas:", e);
        document.getElementById("curso_nome").textContent = "Sem curso";
        if (selectTurma) {
            selectTurma.innerHTML = '<option value="">Erro ao carregar turmas</option>';
        }
        preencherTabela([]);
    }
}

async function carregarAlunos(turmaId){
    try {
        const retorno = await fetch("php/turmas_alunos.php?turma_id=" + encodeURIComponent(turmaId));
        const resposta = await retorno.json();

        if (resposta.status == "ok") {
            const turmaNome = resposta.turma_nome || "Turma selecionada";
            const cursoNome = resposta.curso_nome || document.getElementById("curso_nome").textContent || "Sem curso";
            document.getElementById("turma_descricao").textContent = `${turmaNome} • ${cursoNome}`;
            preencherTabela(resposta.data || []);
        } else {
            document.getElementById("turma_descricao").textContent = resposta.mensagem || "Não foi possível carregar os alunos.";
            preencherTabela([]);
        }
    } catch (e) {
        console.error("Erro ao carregar alunos:", e);
        document.getElementById("turma_descricao").textContent = "Erro ao carregar os alunos.";
        preencherTabela([]);
    }
}

function preencherSelectTurmas(turmas){
    if (!selectTurma) {
        return "";
    }

    let html = '<option value="">Selecione uma turma</option>';
    for (let i = 0; i < turmas.length; i++) {
        const turma = turmas[i];
        html += `<option value="${turma.id}">${turma.nome}</option>`;
    }

    selectTurma.innerHTML = html;
    const primeiraTurma = turmas[0] ? turmas[0].id : "";
    if (primeiraTurma) {
        selectTurma.value = primeiraTurma;
    }
    return primeiraTurma;
}

function preencherTabela(tabela){
    let html = `
    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[980px]">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Matrícula</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CPF</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Celular</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Turma</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Horas Totais</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">`;

    if (!tabela || tabela.length === 0) {
        html += `
        <tr>
            <td colspan="8" class="py-12 text-center text-slate-500 text-sm italic">
                Nenhum aluno encontrado para a turma selecionada.
            </td>
        </tr>`;
    } else {
        for (let i = 0; i < tabela.length; i++) {
            const aluno = tabela[i];
            html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-slate-400">${aluno.id}</td>
                <td class="px-6 py-4 text-sm font-bold text-cyan-600 font-mono">${aluno.matricula_id || '---'}</td>
                <td class="px-6 py-4 text-sm font-semibold text-slate-900">${aluno.nome || '---'}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${aluno.email || '---'}</td>
                <td class="px-6 py-4 text-sm text-slate-600 font-mono">${aluno.cpf || '---'}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${aluno.celular || aluno.telefone || '---'}</td>
                <td class="px-6 py-4">
                    <div class="text-xs font-medium text-slate-700">${aluno.turma_nome || 'Sem turma'}</div>
                    <div class="text-[10px] text-slate-400 uppercase tracking-tighter">${aluno.curso_nome || 'Sem curso'}</div>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-cyan-600">${parseFloat(aluno.total_pontos || 0).toFixed(2)}</td>
            </tr>`;
        }
    }

    html += `</tbody></table></div>`;

    const container = document.getElementById("lista");
    if(container) {
        container.innerHTML = html;
    }
}