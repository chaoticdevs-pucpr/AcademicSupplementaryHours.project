document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ADMIN');
    buscar();
});

document.getElementById("logoff").addEventListener("click", () => {
    logoff();
});

async function logoff(){
    const retorno = await fetch("../../../z_login/logoff.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        window.location.href = "../../../z_login/";
    }
}

async function buscar(){
    const retorno = await fetch("php/coordenador_get.php");
    const resposta = await retorno.json();

    if(resposta.status == "ok" && resposta.data && resposta.data.length > 0){
        preencherTabela(resposta.data);
    }else{
        preencherTabela([]);
    }
}

async function excluir(id){
    if(confirm("Tem certeza que deseja excluir este coordenador?")) {
        const retorno = await fetch("php/coordenador_excluir.php?id=" + id);
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
    // Versão simplificada: Colunas diretas, sem avatares ou agrupamentos complexos
    var html = `
    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>CPF</th>
                    <th>Celular</th>
                    <th>Curso</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>`;

    if (!tabela || tabela.length === 0) {
        html += `
        <tr>
            <td colspan="7">
                Nenhum coordenador encontrado no sistema.
            </td>
        </tr>`;
    } else {
        for(var i = 0; i < tabela.length; i++){
            const coord = tabela[i];
            
            html += `
            <tr>
                <td>${coord.id}</td>
                <td>${coord.nome}</td>
                <td>${coord.email}</td>
                <td>${coord.cpf || '---'}</td>
                <td>${coord.celular || '---'}</td>
                <td>
                    <span>${coord.curso_nome || 'Não vinculado'}</span>
                </td>
                <td>
                    <a href="html/coordenador_alterar.html?id=${coord.id}" >
                        Alterar
                    </a>
                    <button onclick="excluir(${coord.id})">
                        Excluir
                    </button>
                </td>
            </tr>`;
        }
    }

    html += `</tbody></table></div>`;
    document.getElementById("lista").innerHTML = html;
}