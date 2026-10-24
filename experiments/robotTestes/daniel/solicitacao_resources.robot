*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem

*** Variables ***
# Geral
${BROWSER}               Firefox
${URL}                   http://localhost/AcademicSupplementaryHours.project/app/ash/z_login/
${USUARIO}               estudante1@ash.com
${SENHA}                 1234
${CAMPO_USUARIO}         usuario
${CAMPO_SENHA}           senha
${BOTAO_ENTRAR}          enviar
${BOTAO_SOLICITACOES}    solicitacoes

# Parte do CT 1
${BOTAO_NOVA}            xpath=//a[contains(., 'Nova Solicitação')]
${CAMPO_CATEGORIA}       categoria_id
${CAMPO_SUBCATEGORIA}    subcategoria_id
${CAMPO_JUSTIFICATIVA}   justificativa
${BOTAO_SALVAR}          enviar
${ALERT_CT1}             Selecione ao menos um anexo em PDF para enviar a solicitação.

# Parte do CT 2
${CAMPO_ARQUIVO}         arquivo
${ARQUIVO_1}             ${CURDIR}\\arquivos\\comprovante_1.pdf
${ARQUIVO_2}             ${CURDIR}\\arquivos\\comprovante_2.pdf
${ALERT_CT2}             SUCESSO: Registro inserido com sucesso.

# Parte do CT 3
${BOTAO_EXCLUIR}         Excluir
${CONFIRM_EXCLUSAO}      Tem certeza que deseja excluir esta solicitação de horas?
${ALERT_CT3}             SUCESSO: Registro excluido.

# Parte do CT 4
${ALERT_CT4}             ERRO: Somente solicitacoes pendentes podem ser excluidas ou solicitacao nao encontrada.

# Parte do CT 5
${BOTAO_ALTERAR}         Alterar
${ALERT_CT5}             Esta solicitação já foi aprovado e não pode ser alterada.

*** Keywords ***
# Geral
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

Acessar minhas solicitações
    Wait Until Element Is Visible    ${BOTAO_SOLICITACOES}    timeout=10s
    Click Element    ${BOTAO_SOLICITACOES}
    Wait Until Page Contains    Painel de Horas
    Sleep    1s

# Parte do CT 1
Acessar formulário de nova solicitação
    Wait Until Element Is Visible    ${BOTAO_NOVA}    timeout=10s
    Click Element    ${BOTAO_NOVA}
    Wait Until Page Contains Element    ${CAMPO_CATEGORIA}    timeout=10s

Preencher dados da solicitação sem anexo
    Sleep    1s
    Select From List By Index    ${CAMPO_CATEGORIA}       1
    Sleep    1s
    Select From List By Index    ${CAMPO_SUBCATEGORIA}    1
    Input Text                   ${CAMPO_JUSTIFICATIVA}   Participação em curso

Salvar solicitação
    Click Element    ${BOTAO_SALVAR}

Validar aviso de anexo obrigatório
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_CT1}

# Parte do CT 2
Preencher dados da solicitação com múltiplos anexos
    Sleep    1s
    Select From List By Index    ${CAMPO_CATEGORIA}       1
    Sleep    1s
    Select From List By Index    ${CAMPO_SUBCATEGORIA}    1
    Input Text                   ${CAMPO_JUSTIFICATIVA}   Participação em curso
    ${arq1}=    Normalize Path   ${ARQUIVO_1}
    ${arq2}=    Normalize Path   ${ARQUIVO_2}
    Choose File                  ${CAMPO_ARQUIVO}         ${arq1}\n${arq2}

Validar solicitação salva com sucesso
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_CT2}

# Parte do CT 3
Excluir solicitação pendente
    Click Button    ${BOTAO_EXCLUIR}
    ${confirm}=     Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${confirm}    ${CONFIRM_EXCLUSAO}

Validar solicitação excluída
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_CT3}

# Parte do CT 4
Excluir solicitação aprovada
    Click Button    ${BOTAO_EXCLUIR}
    ${confirm}=     Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${confirm}    ${CONFIRM_EXCLUSAO}

Validar erro ao excluir solicitação aprovada
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_CT4}

# Parte do CT 5
Clicar em alterar solicitação aprovada
    Click Link    ${BOTAO_ALTERAR}

Validar aviso de bloqueio de alteração
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Contain    ${alerta}    ${ALERT_CT5}

