async function valida_sessao(perfil = ''){
    let url = "../../z_php/valida_sessao.php";
    if(perfil){
        url += "?perfil=" + encodeURIComponent(perfil);
    }
    const retorno = await fetch(url);
    const resposta = await retorno.json();
    if(resposta.status == "nok"){
        window.location.href = '../login/';
    } else if(resposta.data && resposta.data.nome){
        const userNameElement = document.getElementById('user-name');
        if(userNameElement){
            userNameElement.textContent = resposta.data.nome;
        }
    }
}