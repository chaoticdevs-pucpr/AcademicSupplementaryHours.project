*** Settings ***
Resource          login_novos_resources.robot
Test Setup        Abrir navegador na tela de login
Test Teardown     Fechar navegador com evidencia

*** Test Cases ***
CT-1 Efetuar login com senha incorreta
    Fazer login com    ${EMAIL_ESTUDANTE}    ${SENHA_ERRADA}
    Verificar login recusado

CT-2 Efetuar login com usuario inexistente
    Fazer login com    ${EMAIL_INEXISTENTE}    ${SENHA_VALIDA}
    Verificar login recusado

CT-3 Efetuar login como professor com credenciais validas
    Fazer login com    ${EMAIL_PROFESSOR}    ${SENHA_VALIDA}
    Verificar login realizado com sucesso

CT-4 Efetuar login como coordenador com credenciais validas
    Fazer login com    ${EMAIL_COORDENADOR}    ${SENHA_VALIDA}
    Verificar login realizado com sucesso

CT-5 Efetuar login com e-mail em letras maiusculas
    Fazer login com    ESTUDANTE1@ASH.COM    ${SENHA_VALIDA}
    Verificar login realizado com sucesso
