async function valida_sessao(){
    const retorno = await fetch("../z_php/valida_sessao.php");
    const resposta = await retorno.json();
    if(resposta.status == "nok"){
        window.location.href = "../z_login/";
        return false;
    }
    return true;
}

async function logoff(){
    const retorno = await fetch("../z_php/projeto_logoff.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        window.location.href = "../z_login/";
    }else{
        alert("Falha ao efetuar logoff");
    }
}