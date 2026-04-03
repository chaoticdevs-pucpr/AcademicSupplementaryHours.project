document.addEventListener("DOMContentLoaded", () => {
    valida_sessao();
});

document.getElementById("professores").addEventListener("click", () => {
    window.location.href = '#';
});

document.getElementById("manual_hc").addEventListener("click", () => {
    window.location.href = '#';
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