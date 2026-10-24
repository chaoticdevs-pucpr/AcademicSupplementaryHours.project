*** Settings ***
Library    SeleniumLibrary

*** Variables ***
# Geral
${BROWSER}                Chrome
${URL}                    http://localhost/AcademicSupplementaryHours.project/ash/z_login/

# Locators da tela de login
${CAMPO_USUARIO}          usuario
${CAMPO_SENHA}            senha
${BOTAO_ENTRAR}           enviar

# Mensagem de erro esperada
${ALERT_CREDENCIAIS}      ERRO: Credenciais invalidas.

# Dados de teste
${EMAIL_ESTUDANTE}        estudante1@ash.com
${EMAIL_PROFESSOR}        prof1@ash.com
${EMAIL_COORDENADOR}      coord1@ash.com
${EMAIL_INEXISTENTE}      naoexiste@ash.com
${SENHA_VALIDA}           1234
${SENHA_ERRADA}           senhaErrada123

*** Keywords ***
Abrir navegador na tela de login
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

Fechar navegador com evidencia
    Capture Page Screenshot
    Close Browser

Fazer login com
    [Arguments]    ${usuario}    ${senha}
    Input Text       ${CAMPO_USUARIO}    ${usuario}
    Input Text       ${CAMPO_SENHA}      ${senha}
    Click Element    ${BOTAO_ENTRAR}

Verificar login recusado
    # Captura e aceita o alerta de erro.
    ${alerta}=    Handle Alert    ACCEPT    timeout=10s
    Should Be Equal As Strings    ${alerta}    ${ALERT_CREDENCIAIS}

    # Confirma que continua na tela de login.
    Page Should Contain Element    ${CAMPO_USUARIO}
    Page Should Contain Element    ${CAMPO_SENHA}
    ${url_atual}=    Get Location
    Should Contain    ${url_atual}    /z_login/

Verificar login realizado com sucesso
    # Confirma que saiu da tela de login.
    Wait Until Page Does Not Contain Element    ${CAMPO_USUARIO}    timeout=10s
    ${url_atual}=    Get Location
    Should Not Contain    ${url_atual}    /z_login/
