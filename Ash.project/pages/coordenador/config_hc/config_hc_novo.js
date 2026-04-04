document.addEventListener("DOMContentLoaded", () => {
	valida_sessao('COORDENADOR');
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

async function novo(){
	var versao              = document.getElementById("versao").value;
	var data_manual         = document.getElementById("data_manual").value;
	var horas_objetivo      = document.getElementById("horas_objetivo").value;
	var categoria_nome      = document.getElementById("categoria_nome").value;
	var categoria_max       = document.getElementById("categoria_max").value;
	var subcategoria_nome   = document.getElementById("subcategoria_nome").value;
	var subcategoria_horas  = document.getElementById("subcategoria_horas").value;

	const fd = new FormData();
	fd.append("versao", versao);
	fd.append("data_manual", data_manual);
	fd.append("horas_objetivo", horas_objetivo);
	fd.append("categoria_nome", categoria_nome);
	fd.append("categoria_max", categoria_max);
	fd.append("subcategoria_nome", subcategoria_nome);
	fd.append("subcategoria_horas", subcategoria_horas);

	const retorno = await fetch("config_hc_novo.php", {
		method: "POST",
		body: fd
	});
	const resposta = await retorno.json();

	if(resposta.status == "ok"){
		alert("SUCESSO: " + resposta.mensagem);
		window.location.href = "config_hc_index.html";
	}else{
		alert("ERRO: " + resposta.mensagem);
	}
}
 