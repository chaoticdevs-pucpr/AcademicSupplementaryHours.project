*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem

*** Variables ***
# Geral
${BROWSER}               Firefox
${URL}                   http://localhost/AcademicSupplementaryHours.project/ash/z_login/
${USUARIO}               coord1@ash.com
${SENHA}                 1234
${CAMPO_USUARIO}         usuario
${CAMPO_SENHA}           senha
${BOTAO_ENTRAR}          enviar
${BOTAO_MANUAL}          manual_hc

# Parte do CT 1
${BOTAO_NOVO_MANUAL}     xpath=//a[contains(., 'Nova Versão')]
${CAMPO_VERSAO}          versao
${CAMPO_DATA_MANUAL}     data_manual
${CAMPO_HORAS_OBJETIVO}  horas_objetivo
${BOTAO_SALVAR}          enviar
${ALERT_CT1}             ERRO: A data está invalida.

# Parte do CT 2
${ALERT_CT2}             ERRO: O valor de horas objetivas é inválido.

# Parte do CT 3
${BOTAO_CATEGORIAS}      xpath=//a[contains(@href, 'versao=0.1')]
${BOTAO_NOVA_CATEGORIA}  btnNovo
${CAMPO_DESC_CATEGORIA}  categoria_descricao
${CAMPO_MAX_CATEGORIA}   categoria_max
${CAMPO_NOME_CATEGORIA}  categoria_nome
${BOTAO_SALVAR_CATE}     xpath=//button[contains(., 'Salvar Categoria')]
${ALERT_CT3}             ERRO: O valor de pontos maximos é inválido.

# Parte do CT 4
${ALERT_CT4}             Selecione um valor que não seja menor que 0.

# Parte do CT 5
${BOTAO_SUBCATEGORIAS}             xpath=//a[contains(@href, 'categoria_id=')]
${CAMPO_DESC_SUBCATEGORIA}      subcategoria_descricao
${CAMPO_HORAS_SUBCATEGORIA}     subcategoria_horas
${CAMPO_PONTOS_SUBCATEGORIA}    quant_pontos
${CAMPO_NOME_SUBCATEGORIA}      subcategoria_nome
${BOTAO_SALVAR_SUBCATE}         xpath=//button[contains(., 'Salvar Subcategoria')]
${ALERT_CT5}                    ERRO: O valor de Limite de horas é inválido.

*** Keywords ***
# Geral
Abrir o navegador
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

Fechar o navegador
    Capture Page Screenshot
    Close Browser

Fazer login como coordenador
    Input Text       ${CAMPO_USUARIO}    ${USUARIO}
    Input Text       ${CAMPO_SENHA}      ${SENHA}
    Click Element    ${BOTAO_ENTRAR}

Acessar meus manuais
    Wait Until Element Is Visible    ${BOTAO_MANUAL}    timeout=10s
    Click Element    ${BOTAO_MANUAL}

Acessar minhas categorias
    Wait Until Element Is Visible    ${BOTAO_CATEGORIAS}    timeout=10s
    Click Element    ${BOTAO_CATEGORIAS}

Acessar minhas subcategorias
    Wait Until Element Is Visible    ${BOTAO_SUBCATEGORIAS}    timeout=10s
    Click Element    ${BOTAO_SUBCATEGORIAS}

Acessar formulário de novo manual
    Wait Until Element Is Visible    ${BOTAO_NOVO_MANUAL}    timeout=10s
    Click Element    ${BOTAO_NOVO_MANUAL}

Acessar formulário de nova categoria
    Wait Until Element Is Visible    ${BOTAO_NOVA_CATEGORIA}    timeout=10s
    Click Element    ${BOTAO_NOVA_CATEGORIA}

Acessar formulário de nova subcategoria
    Wait Until Element Is Visible    ${BOTAO_NOVA_CATEGORIA}    timeout=10s
    Click Element    ${BOTAO_NOVA_CATEGORIA}

Salvar manual
    Click Element    ${BOTAO_SALVAR}

Salvar manual com sucesso
    Click Element    ${BOTAO_SALVAR}
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    SUCESSO: Versão inserida com sucesso.

Salvar categoria
    Click Element    ${BOTAO_SALVAR_CATE}

Salvar subcategoria
    Click Element    ${BOTAO_SALVAR_SUBCATE}


# Parte do CT 1

Preencher dados do manual com data inválida
    Wait Until Element Is Visible    ${CAMPO_VERSAO}    timeout=10s
    Input Text    ${CAMPO_VERSAO}       0.0
    Input Text    ${CAMPO_DATA_MANUAL}  2024-02-30
    Input Text    ${CAMPO_HORAS_OBJETIVO}  40

Validar aviso de data inválida
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_CT1}

# Parte do CT 2
Preencher dados do manual com horas inválidas
    Wait Until Element Is Visible    ${CAMPO_VERSAO}    timeout=10s
    Input Text    ${CAMPO_VERSAO}       0.2
    Input Text    ${CAMPO_DATA_MANUAL}  2024-02-27
    Input Text    ${CAMPO_HORAS_OBJETIVO}  -30

Validar aviso de horas inválidas
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_CT2}

# Parte do CT 3
Preencher dados do manual com dados validos
    Wait Until Element Is Visible    ${CAMPO_VERSAO}    timeout=10s
    Input Text    ${CAMPO_VERSAO}       0.1
    Input Text    ${CAMPO_DATA_MANUAL}  2024-02-27
    Input Text    ${CAMPO_HORAS_OBJETIVO}  40

Preencher dados da categoria com pontos maximos maiores que horas objetivo do manual
    Wait Until Element Is Visible    ${CAMPO_DESC_CATEGORIA}    timeout=10s
    Input Text       ${CAMPO_DESC_CATEGORIA}  Categoria 1
    Input Text       ${CAMPO_MAX_CATEGORIA}   50
    Input Text       ${CAMPO_NOME_CATEGORIA}  Categoria 1

Validar categoria com pontos maximos maiores que horas objetivo do manual
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_CT3}

# Parte do CT 4
Preencher dados da categoria com pontos maximos invalidos
    Wait Until Element Is Visible    ${CAMPO_DESC_CATEGORIA}    timeout=10s
    Input Text       ${CAMPO_DESC_CATEGORIA}  Categoria 2
    Input Text       ${CAMPO_MAX_CATEGORIA}   -5
    Input Text       ${CAMPO_NOME_CATEGORIA}  Categoria 2

Validar erro ao inserir pontos maximos invalidos
    ${alerta}=    Execute JavaScript
    ...    return document.querySelector('input[id=categoria_max]').validationMessage;
    Should Contain    ${alerta}    ${ALERT_CT4}

# Parte do CT 5
preencher dados da subcategoria com limite de horas maior que pontos maximos da categoria
    Wait Until Element Is Visible    ${CAMPO_DESC_SUBCATEGORIA}    timeout=10s
    Input Text       ${CAMPO_DESC_SUBCATEGORIA}      Subcategoria 1
    Input Text       ${CAMPO_HORAS_SUBCATEGORIA}     60
    Input Text       ${CAMPO_PONTOS_SUBCATEGORIA}    15
    Input Text       ${CAMPO_NOME_SUBCATEGORIA}      Subcategoria 1

Validar aviso de limite de horas superior a pontos máximos da categoria
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_CT5}

