document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ESTUDANTE');
    carregarSubcategorias();
});

document.getElementById("logoff").addEventListener("click", () => {
	logoff();
});

async function logoff(){
	const retorno = await fetch("../../../z_login/logoff.php");
	const resposta = await retorno.json();
	if(resposta.status == "ok"){
		window.location.href = "../../../z_login/";
	}
}

document.getElementById("enviar").addEventListener("click", () => {
	novo();
});

async function carregarSubcategorias(){
	const retorno = await fetch("solicitacao_subcategorias.php");
	const resposta = await retorno.json();
	if(resposta.status == "ok"){
		var html = '<option value="">Selecione...</option>';
		for(var i = 0; i < resposta.data.length; i++){
			html += `<option value="${resposta.data[i].id}">${resposta.data[i].categoria} - ${resposta.data[i].nome} (${resposta.data[i].quant_horas}h)</option>`;
		}
		document.getElementById("subcategoria_id").innerHTML = html;
	}
}

async function novo(){
	var subcategoria_id  = document.getElementById("subcategoria_id").value;
	var horas_brutas     = document.getElementById("horas_brutas").value;
	var justificativa    = document.getElementById("justificativa").value;

	const fd = new FormData();
	fd.append("subcategoria_id", subcategoria_id);
	fd.append("horas_brutas", horas_brutas);
	fd.append("justificativa", justificativa);

	const arquivo = document.getElementById("arquivo").files[0];
	if(arquivo){
		fd.append("arquivo", arquivo);
	}

	const retorno = await fetch("solicitacao_novo.php", {
		method: "POST",
		body: fd
	});
	const resposta = await retorno.json();

	if(resposta.status == "ok"){
		alert("SUCESSO: " + resposta.mensagem);
		window.location.href = "solicitacao_index.html";
	}else{
		alert("ERRO: " + resposta.mensagem);
	}
}
