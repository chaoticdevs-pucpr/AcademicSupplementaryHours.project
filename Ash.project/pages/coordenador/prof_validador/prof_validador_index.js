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
    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome / E-mail</th>
                    <th>CPF / Contato</th>
                    <th>Turma / Curso</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>`;

    if (!tabela || tabela.length === 0) {
        html += `
        <tr>
            <td colspan="5">
                Nenhum professor validador encontrado no sistema.
            </td>
        </tr>`;
    } else {
        for(var i = 0; i < tabela.length; i++){
            const prof = tabela[i];
            
            // Tratamento de contatos para evitar erros
            let contato = prof.celular ? prof.celular : (prof.telefone ? prof.telefone : '---');

            html += `
            <tr>
                <td>${prof.id}</td>
                <td>
                    <div>${prof.nome}</div>
                    <div>${prof.email}</div>
                </td>
                <td>
                    <div>CPF: ${prof.cpf || '---'}</div>
                    <div>Cont: ${contato}</div>
                </td>
                <td>
                    <div>${prof.turma_nome || 'Sem turma'}</div>
                    <div>${prof.curso_nome || 'Sem curso'}</div>
                </td>
                <td>
                    <a href="html/prof_validador_alterar.html?id=${prof.id}">
                        Alterar
                    </a>
                    <button onclick="excluir(${prof.id})">
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