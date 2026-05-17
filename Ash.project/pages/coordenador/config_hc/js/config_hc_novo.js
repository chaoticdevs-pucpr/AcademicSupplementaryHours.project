document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('COORDENADOR');
});

document.getElementById("logoff").addEventListener("click", () => {
    logoff();
});

async function logoff(){
    const retorno = await fetch("../../../../z_login/logoff.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        window.location.href = "../../../../z_login/";
    }
}

document.getElementById("enviar").addEventListener("click", () => {
    novo();
});

async function novo(){
    var versao         = document.getElementById("versao").value;
    var data_manual    = document.getElementById("data_manual").value;
    var pontos_objetivo = document.getElementById("pontos_objetivo").value;

    if(!versao || !data_manual || !pontos_objetivo){
        alert("Preencha todos os campos da versão.");
        return;
    }

    const fd = new FormData();
    fd.append("versao", versao);
    fd.append("data_manual", data_manual);
    fd.append("pontos_objetivo", pontos_objetivo);

    const retorno = await fetch("../php/config_hc_novo.php", {
        method: "POST",
        body: fd
    });
    const resposta = await retorno.json();

    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "../config_hc_index.html";
    } else {
        alert("ERRO: " + resposta.mensagem);
    }
}
 