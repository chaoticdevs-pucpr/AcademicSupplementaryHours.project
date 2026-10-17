document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ADMIN');
});

document.getElementById("coordenadores").addEventListener("click", () => {
    window.location.href = 'coordenador/coordenador_index.html';
});

document.getElementById("estudantes").addEventListener("click", () => {
    window.location.href = 'estudante/estudante_index.html';
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