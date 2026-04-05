document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ESTUDANTE');

    // MUDANÇA AQUI: de "solicitacoes" para "btn-solicitacoes"
    const btnSolicitacoes = document.getElementById("solicitacoes"); 
    
    if (btnSolicitacoes) {
        btnSolicitacoes.addEventListener("click", () => {
            console.log("Clicou!"); // Para você testar no F12
            window.location.href = 'solicitacao/solicitacao_index.html';
        });
    }

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

});