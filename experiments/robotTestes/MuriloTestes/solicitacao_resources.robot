*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem

*** Variables ***
# geral
${BROWSER}           Firefox
${URL}               http://localhost/AcademicSupplementaryHours.project/ash/z_login/
${USUARIO}           estudante1@ash.com
${SENHA}             1234
${USUARIO_COORD}     coord1@ash.com
${SENHA_COORD}       1234
${CAMPO_USUARIO}     usuario
${CAMPO_SENHA}       senha
${BOTAO_ENTRAR}      enviar

# menu estudante
${BOTAO_SOLICITACOES}   solicitacoes

# ct 1
${BOTAO_ALTERAR}        Alterar
${CAMPO_CATEGORIA}      categoria_id
${CAMPO_SUBCATEGORIA}   subcategoria_id
${CAMPO_HORAS}          horas_brutas
${CAMPO_JUSTIFICATIVA}  justificativa
${BOTAO_SALVAR}         enviar
${ALERT_CT1}            SUCESSO: Registro alterado com sucesso.

# coordenador telas
${BOTAO_MANUAL}         manual_hc
${BOTAO_CATEGORIAS}     link=Categorias
${BOTAO_SUBCATEGORIAS}  link=Subcategorias

# ct 30 e 31 subcategoria
${BOTAO_NOVA_SUB}       xpath=//a[contains(., 'Nova Subcategoria')]
${CAMPO_SUB_NOME}       subcategoria_nome
${CAMPO_SUB_HORAS}      subcategoria_horas
${CAMPO_SUB_PONTOS}     quant_pontos
${BOTAO_SALVAR_SUB}     xpath=//button[@type='submit']
${BOTAO_EXCLUIR_SUB}    xpath=(//button[contains(text(), 'Excluir')])[last()]
${CONFIRM_EXCLUSAO_SUB}    Tem certeza que deseja excluir esta subcategoria?
${ALERT_EXCLUSAO_SUB}      Subcategoria excluída com sucesso.

# ct 32 categoria
${BOTAO_NOVA_CAT}          xpath=//a[contains(., 'Nova Categoria')]
${CAMPO_CAT_NOME}          categoria_nome
${CAMPO_CAT_MAX}           categoria_max
${BOTAO_SALVAR_CAT}        xpath=//button[@type='submit']
${BOTAO_EXCLUIR_CAT}       xpath=(//button[contains(text(), 'Excluir')])[last()]
${CONFIRM_EXCLUSAO_CAT}    Tem certeza que deseja excluir esta categoria?
${ALERT_EXCLUSAO_CAT}      Categoria excluída com sucesso.

# ct 33 turmas coordenador
${BOTAO_TURMAS}            turmas
${FILTRO_TURMA}            filtro_nome
${PRIMEIRA_TURMA}          xpath=(//div[@id='lista']//button)[1]
${MODAL_TURMA}             turma_modal

*** Keywords ***
# geral
Abrir o navegador
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

Fechar o navegador
    Capture Page Screenshot
    Close Browser

Fazer login como estudante
    Input Text       ${CAMPO_USUARIO}    ${USUARIO}
    Input Text       ${CAMPO_SENHA}      ${SENHA}
    Click Element    ${BOTAO_ENTRAR}
    Wait Until Element Is Visible    ${BOTAO_SOLICITACOES}    timeout=10s

Fazer login como coordenador
    Input Text       ${CAMPO_USUARIO}    ${USUARIO_COORD}
    Input Text       ${CAMPO_SENHA}      ${SENHA_COORD}
    Click Element    ${BOTAO_ENTRAR}
    Wait Until Page Contains    Painel do Coordenador    timeout=10s

# parte do ct 1
Acessar minhas solicitacoes
    Wait Until Element Is Visible    ${BOTAO_SOLICITACOES}    timeout=10s
    Click Element    ${BOTAO_SOLICITACOES}
    Wait Until Page Contains    Painel de Horas
    Sleep    1s

Clicar em alterar solicitacao pendente
    Wait Until Element Is Visible    link=${BOTAO_ALTERAR}    timeout=10s
    Click Link    ${BOTAO_ALTERAR}
    Wait Until Page Contains    Alterar Solicitação    timeout=10s

Preencher dados da solicitacao
    Sleep    1s
    Select From List By Index    ${CAMPO_CATEGORIA}       2
    Sleep    1s
    Select From List By Index    ${CAMPO_SUBCATEGORIA}    1
    Clear Element Text           ${CAMPO_HORAS}
    Input Text                   ${CAMPO_HORAS}           16
    Clear Element Text           ${CAMPO_JUSTIFICATIVA}
    Input Text                   ${CAMPO_JUSTIFICATIVA}   pesquisa alterada

Salvar alteracao
    Click Element    ${BOTAO_SALVAR}

Validar solicitacao alterada
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_CT1}
    Wait Until Page Contains    Painel de Horas

# coordenador navegacao
Acessar categorias do manual
    Wait Until Element Is Visible    ${BOTAO_MANUAL}    timeout=10s
    Click Element    ${BOTAO_MANUAL}
    Wait Until Page Contains    Manual de Horas Complementares    timeout=10s
    Wait Until Element Is Visible    ${BOTAO_CATEGORIAS}    timeout=10s
    Click Element    ${BOTAO_CATEGORIAS}
    Wait Until Page Contains    Categorias da Versão    timeout=10s

Acessar subcategorias
    Acessar categorias do manual
    Wait Until Element Is Visible    ${BOTAO_SUBCATEGORIAS}    timeout=10s
    Click Element    ${BOTAO_SUBCATEGORIAS}
    Wait Until Page Contains    Subcategorias    timeout=10s

# parte do ct 30
Acessar nova subcategoria
    Acessar subcategorias
    Click Element    ${BOTAO_NOVA_SUB}
    Wait Until Page Contains    Nova Subcategoria    timeout=10s

Preencher subcategoria com horas negativas
    Input Text       ${CAMPO_SUB_NOME}     teste subcategoria
    Input Text       ${CAMPO_SUB_HORAS}    -10
    Input Text       ${CAMPO_SUB_PONTOS}   5

Salvar subcategoria
    Click Element    ${BOTAO_SALVAR_SUB}

Validar erro de horas invalidas
    ${invalido}=    Execute JavaScript    return document.getElementById('subcategoria_horas').validity.rangeUnderflow;
    Should Be True    ${invalido}
    Page Should Contain    Nova Subcategoria

# parte do ct 31
Criar subcategoria temporaria
    Click Element    ${BOTAO_NOVA_SUB}
    Wait Until Page Contains    Nova Subcategoria    timeout=10s
    Input Text       ${CAMPO_SUB_NOME}     subcategoria pra apagar
    Input Text       ${CAMPO_SUB_HORAS}    20
    Input Text       ${CAMPO_SUB_PONTOS}   5
    Click Element    ${BOTAO_SALVAR_SUB}
    ${alerta}=       Handle Alert    ACCEPT    timeout=10s
    Wait Until Page Contains    Subcategorias    timeout=10s
    Wait Until Element Is Visible    ${BOTAO_EXCLUIR_SUB}    timeout=10s

Excluir subcategoria
    Wait Until Element Is Visible    ${BOTAO_EXCLUIR_SUB}    timeout=10s
    Click Element    ${BOTAO_EXCLUIR_SUB}
    ${confirm}=      Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${confirm}    ${CONFIRM_EXCLUSAO_SUB}

Validar exclusao da subcategoria
    ${alerta}=       Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_EXCLUSAO_SUB}
    Wait Until Page Contains    Subcategorias

# parte do ct 32
Criar categoria temporaria
    Click Element    ${BOTAO_NOVA_CAT}
    Wait Until Page Contains    Nova Categoria    timeout=10s
    Input Text       ${CAMPO_CAT_NOME}    categoria pra apagar
    Input Text       ${CAMPO_CAT_MAX}     30
    Click Element    ${BOTAO_SALVAR_CAT}
    ${alerta}=       Handle Alert    ACCEPT    timeout=10s
    Wait Until Page Contains    Categorias da Versão    timeout=10s
    Wait Until Element Is Visible    ${BOTAO_EXCLUIR_CAT}    timeout=10s

Excluir categoria
    Wait Until Element Is Visible    ${BOTAO_EXCLUIR_CAT}    timeout=10s
    Click Element    ${BOTAO_EXCLUIR_CAT}
    ${confirm}=      Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${confirm}    ${CONFIRM_EXCLUSAO_CAT}

Validar exclusao da categoria
    ${alerta}=       Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_EXCLUSAO_CAT}
    Wait Until Page Contains    Categorias da Versão

# parte do ct 33
Acessar turmas do coordenador
    Wait Until Element Is Visible    ${BOTAO_TURMAS}    timeout=10s
    Click Element    ${BOTAO_TURMAS}
    Wait Until Page Contains    Selecione uma turma para ver os alunos    timeout=10s

Filtrar por nome da turma
    [Arguments]    ${nome}=A-M
    Wait Until Element Is Visible    ${FILTRO_TURMA}    timeout=10s
    Input Text       ${FILTRO_TURMA}    ${nome}
    Sleep    1s

Abrir modal da turma
    Wait Until Element Is Visible    ${PRIMEIRA_TURMA}    timeout=10s
    Click Element    ${PRIMEIRA_TURMA}
    Wait Until Element Is Visible    ${MODAL_TURMA}    timeout=10s

Validar alunos da turma carregados
    Wait Until Page Contains    Alunos completos    timeout=10s
    Page Should Contain    Matrícula
