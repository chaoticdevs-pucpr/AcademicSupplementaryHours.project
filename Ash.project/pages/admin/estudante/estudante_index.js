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
        const retorno = await fetch("php/estudante_get.php");
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
        const retorno = await fetch("php/estudante_excluir.php?id=" + id);
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
    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Matrícula</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>CPF</th>
                    <th>Celular</th>
                    <th>Turma / Curso</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>`;

    if (!tabela || tabela.length === 0) {
        html += `
        <tr>
            <td colspan="8">
                Nenhum estudante encontrado no sistema.
            </td>
        </tr>`;
    } else {
        for(var i = 0; i < tabela.length; i++){
            const est = tabela[i];
            
            html += `
            <tr>
                <td>${est.id}</td>
                <td>${est.matricula_id || '---'}</td>
                <td>${est.nome}</td>
                <td>${est.email}</td>
                <td>${est.cpf || '---'}</td>
                <td>${est.celular || est.telefone || '---'}</td>
                <td>
                    <div>${est.turma_nome || 'Sem turma'}</div>
                    <div>${est.curso_nome || 'Sem curso'}</div>
                </td>
                <td>
                    <a href="html/estudante_alterar.html?id=${est.id}">
                        Alterar
                    </a>
                    <button onclick="excluir(${est.id})">
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