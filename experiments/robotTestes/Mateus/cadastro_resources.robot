
*** Settings ***
Library    SeleniumLibrary

*** Variables ***
# Geral
${BROWSER}               Chrome
${URL}                   http://localhost/AcademicSupplementaryHours.project/ash/z_login/

# Credenciais de teste cadastradas no banco inicial
${USUARIO_ADMIN}         admin@ash.com
${SENHA_ADMIN}           1234

${TIMEOUT}               10s

# Login
${CAMPO_USUARIO}         id=usuario
${CAMPO_SENHA}           id=senha
${BOTAO_ENTRAR}          id=enviar

# Navegação administrativa
${MENU_COORDENADORES}    id=coordenadores
${MENU_ESTUDANTES}       id=estudantes
${BOTAO_CADASTRAR_COORD}    xpath=//a[@href='html/coordenador_novo.html']
${BOTAO_NOVO_ESTUDANTE}  xpath=//a[@href='html/estudante_novo.html']

# Formulário de coordenador
${COORD_NOME}            id=nome
${COORD_EMAIL}           id=email
${COORD_SENHA}           id=senha
${COORD_CPF}             id=cpf
${COORD_CELULAR}         id=celular
${COORD_TELEFONE}        id=telefone
${COORD_CURSO}           id=curso_id
${BOTAO_SALVAR_COORD}    id=enviar

# Formulário de estudante
${ALUNO_NOME}            id=nome
${ALUNO_EMAIL}           id=email
${ALUNO_SENHA}           id=senha
${ALUNO_CPF}             id=cpf
${ALUNO_CELULAR}         id=celular
${ALUNO_TELEFONE}        id=telefone
${ALUNO_TURMA}           id=turma_id
${BOTAO_SALVAR_ALUNO}    id=enviar

# Dados de teste
${COORD_NOME_VALIDO}     Coordenador Teste Robot
${COORD_SENHA_VALIDA}    Teste@123
${COORD_CELULAR_VALIDO}  41999998888
${COORD_TEL_VALIDO}      4133334444

${ALUNO_NOME_VALIDO}     Estudante Teste Robot
${ALUNO_EMAIL_DUPLICADO}    estudante1@ash.com
${ALUNO_SENHA_VALIDA}    1234
${ALUNO_CELULAR_VALIDO}  41988887777
${ALUNO_TEL_VALIDO}      4133335555

*** Keywords ***
# Geral
Abrir o navegador
    ${ID_UNICO}=    Evaluate    uuid.uuid4().hex    modules=uuid
    ${CPF_UNICO}=    Evaluate    random.randint(10000000000, 99999999999)    modules=random
    Set Test Variable    ${COORD_EMAIL_VALIDO}    coord.robot.${ID_UNICO}@ash.com
    Set Test Variable    ${COORD_CPF_VALIDO}    ${CPF_UNICO}
    Set Test Variable    ${ALUNO_EMAIL_VALIDO}    aluno.robot.${ID_UNICO}@ash.com
    Set Test Variable    ${ALUNO_CPF_VALIDO}    ${CPF_UNICO}
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Timeout    ${TIMEOUT}

Fechar o navegador
    Capture Page Screenshot
    Close Browser

Fazer login como administrador
    Wait Until Element Is Visible    ${CAMPO_USUARIO}
    Input Text    ${CAMPO_USUARIO}    ${USUARIO_ADMIN}
    Input Password    ${CAMPO_SENHA}    ${SENHA_ADMIN}
    Click Element    ${BOTAO_ENTRAR}
    Wait Until Page Contains    Painel de Administração    timeout=${TIMEOUT}

# Navegação
Acessar cadastro de coordenadores
    Click Element    ${MENU_COORDENADORES}
    Wait Until Page Contains    Coordenadores    timeout=${TIMEOUT}
    Click Element    ${BOTAO_CADASTRAR_COORD}
    Wait Until Page Contains    Adicionar Coordenador    timeout=${TIMEOUT}
    Wait Until Page Contains    Engenharia    timeout=${TIMEOUT}

Acessar cadastro de estudantes
    Click Element    ${MENU_ESTUDANTES}
    Wait Until Page Contains    Estudantes    timeout=${TIMEOUT}
    Click Element    ${BOTAO_NOVO_ESTUDANTE}
    Wait Until Page Contains    Adicionar Estudante    timeout=${TIMEOUT}
    Wait Until Page Contains    Engenharia    timeout=${TIMEOUT}

# Coordenador
Preencher coordenador válido
    Input Text        ${COORD_NOME}        ${COORD_NOME_VALIDO}
    Input Text        ${COORD_EMAIL}       ${COORD_EMAIL_VALIDO}
    Input Password    ${COORD_SENHA}      ${COORD_SENHA_VALIDA}
    Input Text        ${COORD_CPF}         ${COORD_CPF_VALIDO}
    Input Text        ${COORD_CELULAR}     ${COORD_CELULAR_VALIDO}
    Input Text        ${COORD_TELEFONE}    ${COORD_TEL_VALIDO}
    Select From List By Index    ${COORD_CURSO}    1

Salvar coordenador
    Click Element    ${BOTAO_SALVAR_COORD}

# Estudante
Preencher estudante válido
    Input Text        ${ALUNO_NOME}        ${ALUNO_NOME_VALIDO}
    Input Text        ${ALUNO_EMAIL}       ${ALUNO_EMAIL_VALIDO}
    Input Password    ${ALUNO_SENHA}      ${ALUNO_SENHA_VALIDA}
    Input Text        ${ALUNO_CPF}         ${ALUNO_CPF_VALIDO}
    Input Text        ${ALUNO_CELULAR}     ${ALUNO_CELULAR_VALIDO}
    Input Text        ${ALUNO_TELEFONE}    ${ALUNO_TEL_VALIDO}
    Select From List By Index    ${ALUNO_TURMA}    1

Salvar estudante
    Click Element    ${BOTAO_SALVAR_ALUNO}

# Validação de mensagens em alert JavaScript
Validar alerta contendo
    [Arguments]    ${texto_esperado}
    ${mensagem}=    Handle Alert    action=ACCEPT    timeout=${TIMEOUT}
    Should Contain    ${mensagem.lower()}    ${texto_esperado.lower()}
