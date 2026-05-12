document.addEventListener("DOMContentLoaded", async () => {
    valida_sessao('COORDENADOR');

    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    if(id){
        await buscar(id);
    } else {
        alert("ID não informado.");
        window.location.href = "../config_hc_index.html";
    }
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
    alterar();
});

async function buscar(id){
    const retorno = await fetch("../php/config_hc_get.php?id=" + id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        const r = resposta.data[0];
        document.getElementById("manual_id").value = r.manual_id;
        document.getElementById("versao").value = r.versao;
        document.getElementById("data_manual").value = r.data_manual;
        document.getElementById("horas_objetivo").value = r.horas_objetivo;
    } else {
        alert(resposta.mensagem);
        window.location.href = "../config_hc_index.html";
    }
}

async function alterar(){
    var manual_id         = document.getElementById("manual_id").value;
    var versao            = document.getElementById("versao").value;
    var data_manual       = document.getElementById("data_manual").value;
    var horas_objetivo    = document.getElementById("horas_objetivo").value;

    if(!manual_id || !versao || !data_manual || !horas_objetivo){
        alert("Preencha todos os campos da versão.");
        return;
    }

    const fd = new FormData();
    fd.append("versao", versao);
    fd.append("data_manual", data_manual);
    fd.append("horas_objetivo", horas_objetivo);

    const retorno = await fetch("../php/config_hc_alterar.php?id=" + manual_id, {
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
