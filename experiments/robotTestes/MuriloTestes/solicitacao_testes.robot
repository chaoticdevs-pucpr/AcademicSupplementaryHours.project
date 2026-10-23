*** Settings ***
Resource          solicitacao_resources.robot

Test Setup        Abrir o navegador
Test Teardown     Fechar o navegador

*** Test Cases ***
# Parte do CT 1
CT1 - Alterar solicitacao pendente
    Fazer login como estudante
    Acessar minhas solicitacoes
    Clicar em alterar solicitacao pendente
    Preencher dados da solicitacao
    Salvar alteracao
    Validar solicitacao alterada

# Parte do CT 30
CT30 - Limite de horas negativo
    Fazer login como coordenador
    Acessar nova subcategoria
    Preencher subcategoria com horas negativas
    Salvar subcategoria
    Validar erro de horas invalidas

# Parte do CT 31
CT31 - Excluir subcategoria
    Fazer login como coordenador
    Acessar subcategorias
    Criar subcategoria temporaria
    Excluir subcategoria
    Validar exclusao da subcategoria

# Parte do CT 32
CT32 - Excluir categoria
    Fazer login como coordenador
    Acessar categorias do manual
    Criar categoria temporaria
    Excluir categoria
    Validar exclusao da categoria

# Parte do CT 33
CT33 - Visualizar alunos de uma turma
    Fazer login como coordenador
    Acessar turmas do coordenador
    Filtrar por nome da turma    A-M
    Abrir modal da turma
    Validar alunos da turma carregados
