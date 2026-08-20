async function valida_sessao(){
    const retorno = await fetch("http://localhost/AcademicSupplementaryHours.project/Ash.project/z_php/valida_sessao.php");
    const resposta = await retorno.json();
    if(resposta.status == "nok"){
        window.location.href = "http://localhost/AcademicSupplementaryHours.project/Ash.project/z_login/";
        
    } else if(resposta.data && resposta.data.nome){
        const userNameElement = document.getElementById('user-name');
        if(userNameElement){
            userNameElement.textContent = resposta.data.nome;
        }
    }
}