document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ESTUDANTE');
    carregarCategorias();
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

function calcularPontosJS(subcategoria, dados){
	const tipo = (subcategoria.tipo_calculo || subcategoria.tipo || 'FIXO').toUpperCase();
	const qPontos = Number(subcategoria.quant_pontos ?? subcategoria.quant ?? 0);
	const valorRef = Number(subcategoria.valor_referencia ?? subcategoria.valorRef ?? 1);
	const horas = (dados.horas_brutas != null) ? Number(dados.horas_brutas) : null;

	let pontos = 0;
	switch(tipo){
		case 'HORA':
			if(horas === null) return 0;
			const unitsH = Math.floor(horas / Math.max(1, valorRef));
			pontos = unitsH * qPontos;
			break;
		case 'PERIODO':
			if(horas !== null){
				const meses = Math.floor(horas / 160);
				const unitsP = Math.floor(meses / Math.max(1, Math.floor(valorRef)));
				pontos = unitsP * qPontos;
			} else {
				pontos = 0;
			}
			break;
		case 'ANO':
			if(horas !== null){
				const anos = Math.floor(horas / (160 * 12));
				const unitsA = Math.floor(anos / Math.max(1, Math.floor(valorRef)));
				pontos = unitsA * qPontos;
			} else puntos = 0;
			break;
		case 'SEMESTRE':
			if(horas !== null){
				const sems = Math.floor(horas / (160 * 6));
				const unitsS = Math.floor(sems / Math.max(1, Math.floor(valorRef)));
				pontos = unitsS * qPontos;
			} else pontos = 0;
			break;
		case 'FIXO':
		default:
			pontos = Number(qPontos);
	}
	return Number(pontos);
}

document.getElementById("enviar").addEventListener("click", () => {
	novo();
});

document.getElementById("categoria_id").addEventListener("change", () => {
	carregarSubcategorias();
});

document.getElementById("subcategoria_id").addEventListener("change", () => {
	atualizarCamposEPreview();
});

document.getElementById("horas_brutas").addEventListener("input", () => {
	atualizarCamposEPreview();
});

function atualizarCamposEPreview(){
	const select = document.getElementById('subcategoria_id');
	const opcao = select.options[select.selectedIndex];
	const previewArea = document.getElementById('preview_area');
	const divHoras = document.getElementById('div_horas');
	const horasLabel = document.getElementById('horas_label');
	const unidadeInfo = document.getElementById('unidade_info');

	if(!opcao || !opcao.value){
		if(previewArea) previewArea.classList.add('hidden');
		return;
	}

	const tipo = (opcao.getAttribute('data-tipo_calculo') || 'FIXO').toUpperCase();
	const valorRef = parseFloat(opcao.getAttribute('data-valor_referencia') || '1');
	const quant = parseFloat(opcao.getAttribute('data-quant_pontos') || '0');
	const unidade = opcao.getAttribute('data-unidade') || document.getElementById('unidade_info')?.textContent || '';

	// Mostrar/ocultar campo de horas conforme tipo
	if(tipo === 'FIXO'){
		if(divHoras) divHoras.style.display = 'none';
	} else {
		if(divHoras) divHoras.style.display = '';
	}

	// Ajustar unidade (ex: hrs, meses, anos)
	if(horasLabel){
		if(tipo === 'HORA') horasLabel.textContent = 'hrs';
		else if(tipo === 'PERIODO') horasLabel.textContent = 'meses (aprox)';
		else if(tipo === 'ANO') horasLabel.textContent = 'anos (aprox)';
		else if(tipo === 'SEMESTRE') horasLabel.textContent = 'semestres (aprox)';
		else horasLabel.textContent = '';
	}

	// Mostrar info de unidade/valor
	if(unidadeInfo){
		unidadeInfo.textContent = `Unidade: ${unidade || 'PONTO'} • Valor ref: ${valorRef} • Pontos por unidade: ${quant}`;
	}

	// Calcular estimativa
	const horas = parseFloat(document.getElementById('horas_brutas').value || '0');
	const estimativa = calcularPontosJS({tipo_calculo: tipo, quant_pontos: quant, valor_referencia: valorRef}, {horas_brutas: horas});
	const pontosPreview = document.getElementById('pontos_preview');
	if(pontosPreview){
		pontosPreview.textContent = `Estimativa: ${estimativa} pontos`;
	}
	if(previewArea) previewArea.classList.remove('hidden');
}

async function carregarCategorias(){
	const retorno = await fetch("../php/solicitacao_categorias.php");
	const resposta = await retorno.json();
	if(resposta.status == "ok"){
		var html = '<option value="">Selecione...</option>';
		for(var i = 0; i < resposta.data.length; i++){
			html += `<option value="${resposta.data[i].id}">${resposta.data[i].nome}</option>`;
		}
		document.getElementById("categoria_id").innerHTML = html;
	}else{
		document.getElementById("categoria_id").innerHTML = '<option value="">Sem categorias disponiveis</option>';
		alert("ERRO: " + resposta.mensagem);
	}
}

async function carregarSubcategorias(){
	const categoria_id = document.getElementById("categoria_id").value;
	if(categoria_id == ""){
		document.getElementById("subcategoria_id").innerHTML = '<option value="">Selecione categoria primeiro</option>';
		return;
	}
	const retorno = await fetch("../php/solicitacao_subcategorias.php?categoria_id=" + categoria_id);
	const resposta = await retorno.json();
	if(resposta.status == "ok"){
		var html = '<option value="">Selecione...</option>';
		for(var i = 0; i < resposta.data.length; i++){
			const s = resposta.data[i];
				html += `<option value="${s.id}" data-quant_pontos="${s.quant_pontos}" data-tipo_calculo="${s.tipo_calculo}" data-valor_referencia="${s.valor_referencia}" data-unidade="${s.unidade_referencia}" data-categoria_id="${s.categoria_id}">${s.nome} (${s.quant_pontos} pontos)</option>`;
		}
		document.getElementById("subcategoria_id").innerHTML = html;
		atualizarCamposEPreview();
	}else{
		document.getElementById("subcategoria_id").innerHTML = '<option value="">Sem subcategorias disponiveis</option>';
		alert("ERRO: " + resposta.mensagem);
	}
}

function preencherCategoriaSelecionada(){
	const select = document.getElementById("subcategoria_id");
	const opcao = select.options[select.selectedIndex];
	if(opcao && opcao.value != ""){
		document.getElementById("categoria_nome").value = opcao.getAttribute("data-categoria") || "";
	}else{
		document.getElementById("categoria_nome").value = "";
	}
}

async function novo(){
	var subcategoria_id  = document.getElementById("subcategoria_id").value;
	var horas_brutas     = document.getElementById("horas_brutas").value;
	var justificativa    = document.getElementById("justificativa").value;

	// Valida anexos
	const arquivos = document.getElementById("arquivo").files;
	if(arquivos.length > 5){
		alert('Você pode enviar no máximo 5 anexos por solicitação.');
		return;
	}

	// calcular estimativa de pontos e checar limite da categoria
	const select = document.getElementById("subcategoria_id");
	const opcao = select.options[select.selectedIndex];
	if(opcao && opcao.value !== ""){
		const quant = parseFloat(opcao.getAttribute('data-quant_pontos') || '0');
		const tipo = (opcao.getAttribute('data-tipo_calculo') || 'FIXO').toUpperCase();
		const valorRef = parseFloat(opcao.getAttribute('data-valor_referencia') || '1');
		const categoriaId = parseInt(opcao.getAttribute('data-categoria_id') || '0');

		const estimativa = calcularPontosJS({tipo_calculo: tipo, quant_pontos: quant, valor_referencia: valorRef}, {horas_brutas: parseFloat(horas_brutas || 0)});
		// buscar resumo para achar total atual da categoria
		try{
			const resp = await fetch("../../php/estudante_resumo.php");
			const j = await resp.json();
			if(j.status === 'ok' && Array.isArray(j.data.categorias)){
				const cat = j.data.categorias.find(c => parseInt(c.categoria_id) === categoriaId);
				if(cat){
					const totalAtual = parseFloat(cat.total_pontos || 0);
					const maxP = parseFloat(cat.max_pontos || 0);
					if(estimativa <= 0){
						alert('A estimativa de pontos é zero. Verifique as horas informadas.');
						return;
					}
					if(estimativa > quant){
						alert('A estimativa de pontos excede o limite da subcategoria. Ajuste as horas.');
						return;
					}
					if((totalAtual + estimativa) > maxP){
						alert('Esta solicitação, se aprovada integralmente, ultrapassaria o limite de pontos da categoria. Ajuste ou consulte seu professor.');
						return;
					}
				}
			}
		}catch(e){
			console.error('Erro ao verificar limite da categoria', e);
		}
	}

	const fd = new FormData();
	fd.append("subcategoria_id", subcategoria_id);
	fd.append("horas_brutas", horas_brutas);
	fd.append("justificativa", justificativa);

	for(const arquivo of arquivos){
		fd.append("arquivo[]", arquivo);
	}

	const retorno = await fetch("../php/solicitacao_novo.php", {
		method: "POST",
		body: fd
	});
	const resposta = await retorno.json();

	if(resposta.status == "ok"){
		alert("SUCESSO: " + resposta.mensagem);
			window.location.href = "../solicitacao_index.html";
	}else{
		alert("ERRO: " + resposta.mensagem);
	}
}
