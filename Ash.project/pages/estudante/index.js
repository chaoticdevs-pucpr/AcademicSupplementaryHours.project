document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ESTUDANTE');
});

document.getElementById("solicitacoes").addEventListener("click", () => {
    window.location.href = 'solicitacao/solicitacao_index.html';
});

document.getElementById("logoff").addEventListener("click", () => {
    logoff();
});

async function logoff(){
    const retorno = await fetch("../../z_login/logoff.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        window.location.href = "../../z_login/";
    }
}
