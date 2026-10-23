
*** Settings ***
Resource          cadastro_resources.robot

Test Setup        Abrir o navegador
Test Teardown     Fechar o navegador

*** Test Cases ***

# CT 20 - Coordenador sem nome
CT20 - Cadastrar coordenador sem nome
    Fazer login como administrador
    Acessar cadastro de coordenadores
    Preencher coordenador válido
    Clear Element Text    ${COORD_NOME}
    Salvar coordenador
    Validar alerta contendo    obrigatorios
    Validar campo nome obrigatório

# CT 21 - Coordenador com e-mail inválido
CT21 - Cadastrar coordenador com email inválido
    Fazer login como administrador
    Acessar cadastro de coordenadores
    Preencher coordenador válido
    Clear Element Text    ${COORD_EMAIL}
    Input Text    ${COORD_EMAIL}    @
    Salvar coordenador
    Validar alerta contendo    e-mail valido
    Validar email inválido

# CT 22 - Coordenador com dados válidos
CT22 - Cadastrar coordenador com dados válidos
    Fazer login como administrador
    Acessar cadastro de coordenadores
    Preencher coordenador válido
    Salvar coordenador
    Validar alerta contendo    sucesso
    Wait Until Element Is Visible    xpath=//a[@href='html/coordenador_novo.html']    timeout=${TIMEOUT}

# CT 23 - Estudante com e-mail duplicado
CT23 - Cadastrar estudante com email já utilizado
    Fazer login como administrador
    Acessar cadastro de estudantes
    Preencher estudante válido
    Clear Element Text    ${ALUNO_EMAIL}
    Input Text    ${ALUNO_EMAIL}    ${ALUNO_EMAIL_DUPLICADO}
    Salvar estudante
    Validar erro de e-mail duplicado

# CT 24 - Estudante com dados válidos
CT24 - Cadastrar estudante com dados válidos
    Fazer login como administrador
    Acessar cadastro de estudantes
    Preencher estudante válido
    Salvar estudante
    Validar alerta contendo    sucesso
    Wait Until Element Is Visible    xpath=//a[@href='html/estudante_novo.html']    timeout=${TIMEOUT}


*** Keywords ***

Validar campo nome obrigatório
    ${vazio}=    Execute Javascript
    ...    return document.getElementById("nome").validity.valueMissing
    Should Be True    ${vazio}
    Page Should Contain Element    ${COORD_NOME}

Validar email inválido
    ${valido}=    Execute Javascript
    ...    return document.getElementById("email").validity.valid
    Should Be Equal    ${valido}    ${False}
    Page Should Contain Element    ${COORD_EMAIL}

Validar erro de e-mail duplicado
    ${mensagem}=    Handle Alert    action=ACCEPT    timeout=${TIMEOUT}
    Should Contain    ${mensagem.lower()}    erro
    Should Contain    ${mensagem.lower()}    falha ao inserir usuario
