
*** Settings ***
Resource          israel_resources.robot
Test Setup        Abrir o navegador
Test Teardown     Fechar o navegador

*** Test Cases ***
CT-1 Verificar se os campos Usuario e Senha sao preenchiveis
    # Verificar se ambos os campos estao habilitados.
    Element Should Be Enabled    ${CAMPO_USUARIO}
    Element Should Be Enabled    ${CAMPO_SENHA}

    # Preencher os campos com os dados de teste.
    Input Text    ${CAMPO_USUARIO}    ${USUARIO}
    Input Text    ${CAMPO_SENHA}      ${SENHA}

    # Verificar se os valores foram preenchidos corretamente.
    ${usuario_preenchido}=    Get Value    ${CAMPO_USUARIO}
    Should Be Equal As Strings    ${usuario_preenchido}    ${USUARIO}

    ${senha_preenchida}=    Get Value    ${CAMPO_SENHA}
    Should Be Equal As Strings    ${senha_preenchida}    ${SENHA}

CT-2 Efetuar login com campos vazios
    # Garantir que os dois campos estejam vazios.
    Clear Element Text    ${CAMPO_USUARIO}
    Clear Element Text    ${CAMPO_SENHA}

    # Verificar que os campos realmente estao vazios.
    ${usuario_inicial}=    Get Value    ${CAMPO_USUARIO}
    Should Be Equal As Strings    ${usuario_inicial}    ${EMPTY}

    ${senha_inicial}=    Get Value    ${CAMPO_SENHA}
    Should Be Equal As Strings    ${senha_inicial}    ${EMPTY}

    # Tentar entrar sem preencher os campos.
    Click Element    ${BOTAO_ENTRAR}
    Verificar se nao foi logado

CT-3 Testar botao "Voltar para a página inicial"
    Click Link   ← Voltar para a página inicial
    Wait Until Location Contains    index.html    timeout=10s


CT-4 Efetuar login como estudante com credenciais válidas
    fazer login como estudante
   
CT-5 Realizar logout como estudante
    fazer login como estudante
    click element    id=logoff
    Wait until Element is Visible    ${CAMPO_USUARIO}    timeout=10s

CT-6 Efetuar login com usuário INATIVO
    Input text    ${CAMPO_USUARIO}    ${USUARIO_INATIVO}
    Input text    ${CAMPO_SENHA}      ${SENHA_INATIVA}
    Click Element    ${BOTAO_ENTRAR}
    verificar se inativo
