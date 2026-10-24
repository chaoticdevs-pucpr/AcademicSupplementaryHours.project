
*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem

*** Variables ***
# Geral
${BROWSER}               Chrome
${URL}                   http://localhost/Academic/ash/z_login/
${USUARIO}               estudante1@ash.com
${SENHA}                 1234
${CAMPO_USUARIO}         usuario
${CAMPO_SENHA}           senha
${BOTAO_ENTRAR}          enviar
${BOTAO_SOLICITACOES}    solicitacoes
${ALERT_EMPTY}           ERRO: Credenciais invalidas.
${ALERT_INATIVO}         ERRO: Esse usuário não está mais ativo no sistema.
${SENHA_INATIVA}         1234
${USUARIO_INATIVO}       prof6@ash.com

*** Keywords ***
# Geral
Abrir o navegador
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

Fechar o navegador
    Capture Page Screenshot
    Close Browser


Verificar se nao foi logado
    # Capturar e aceitar o alerta de erro.
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Be Equal As Strings    ${alerta}    ${ALERT_EMPTY}

    # Confirmar que os campos continuam na pagina.
    Page Should Contain Element    ${CAMPO_USUARIO}
    Page Should Contain Element    ${CAMPO_SENHA}

    # Confirmar que continua na tela de login.
    ${url_atual}=    Get Location
    Should Contain    ${url_atual}    /z_login/

    # Confirmar que a area de solicitacoes nao esta presente.
    Page Should Not Contain Element    ${BOTAO_SOLICITACOES}

Fazer login como estudante
    Input Text       ${CAMPO_USUARIO}    ${USUARIO}
    Input Text       ${CAMPO_SENHA}      ${SENHA}
    Click Element    ${BOTAO_ENTRAR}
    Wait Until Element Is Visible    ${BOTAO_SOLICITACOES}    timeout=10s

Verificar se inativo
    # Capturar e aceitar o alerta de erro.
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Be Equal As Strings    ${alerta}    ${ALERT_INATIVO}

    # Confirmar que os campos continuam na pagina.
    Page Should Contain Element    ${CAMPO_USUARIO}
    Page Should Contain Element    ${CAMPO_SENHA}

    # Confirmar que continua na tela de login.
    ${url_atual}=    Get Location
    Should Contain    ${url_atual}    /z_login/

    # Confirmar que a area de solicitacoes nao esta presente.
    Page Should Not Contain Element    ${BOTAO_SOLICITACOES}

