async function valida_sessao(perfilEsperado = ''){
    try {
        let url = '../php/valida_sessao.php';
        if(perfilEsperado){
            url += '?perfil=' + encodeURIComponent(perfilEsperado);
        }
        const retorno = await fetch(url);
        const resposta = await retorno.json();
        if(resposta.status == "nok"){
            alert("AVISO: " + resposta.mensagem);
            window.location.href = '../login/';
        }
    } catch(e) {
        console.error("Erro ao validar sessao:", e);
        window.location.href = '../login/';
    }
}

// async function valida_sessao(){
//     const retorno = await fetch("../php/valida_sessao.php");
//     const resposta = await retorno.json();
//     if(resposta.status == "nok"){
//         windows.location.href = '../login/';
//     }
// }