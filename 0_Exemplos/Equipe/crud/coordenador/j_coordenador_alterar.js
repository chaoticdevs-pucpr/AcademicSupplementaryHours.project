document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("enviar").addEventListener('click', function(){
        alterar();
    });
    document.getElementById("logoff").addEventListener("click", () => {
        logoff();
    });
    var url = new URLSearchParams(window.location.search);
    var id = url.get("id");
    valida_sessao();
    await carregarDados();
    await buscarDados(id);
});

async function carregarDados() {
    try {
        const resCursos = await fetch("../z_php/carregar_dados.php?tipo=cursos");
        const cursos = await resCursos.json();
        const selectCurso = document.getElementById("curso_id");
        cursos.forEach(curso => {
            const option = document.createElement("option");
            option.value = curso.id;
            option.textContent = curso.nome;
            selectCurso.appendChild(option);
        });
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

async function alterar(){
    var nome = document.getElementById("nome").value;
    var cpf = document.getElementById("cpf").value;
    var email = document.getElementById("email").value;
    var endereco = document.getElementById("endereco").value;
    var celular = document.getElementById("celular").value;
    var residencial = document.getElementById("residencial").value;
    var curso_id = document.getElementById("curso_id").value;
    var id = document.getElementById("id").value;

    console.log("Dados:", {id, nome, cpf, email, endereco, celular, residencial, curso_id});

    if (!nome || !cpf || !email || !endereco || !celular || !curso_id) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const fd = new FormData();
    fd.append('nome', nome);
    fd.append('cpf', cpf);
    fd.append('email', email);
    fd.append('endereco', endereco);
    fd.append('celular', celular);
    fd.append('residencial', residencial);
    fd.append('curso_id', curso_id);

    const retorno = await fetch("p_coordenador_alterar.php?id="+id,  {
        method: "POST",
        body: fd
    });
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("Sucesso! " + resposta.mensagem);
        window.location.href = 'h_coordenador_index.html';
    }else{
        alert("ERRO! " + resposta.mensagem);
    }
}

async function buscarDados(id){
    const retorno = await fetch("p_coordenador_get.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == "ok" && resposta.data.length > 0){
        var dados = resposta.data[0];
        document.getElementById("id").value = dados.id;
        document.getElementById("nome").value = dados.nome;
        document.getElementById("cpf").value = dados.cpf;
        document.getElementById("email").value = dados.email;
        document.getElementById("endereco").value = dados.endereco;
        document.getElementById("celular").value = dados.celular;
        document.getElementById("residencial").value = dados.residencial || '';
        document.getElementById("curso_id").value = dados.curso_id;
    }else{
        alert("Erro ao buscar dados: " + resposta.mensagem);
    }
}