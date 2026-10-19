*** Settings ***
Resource          solicitacao_resources.robot

Test Setup        Abrir o navegador
Test Teardown     Fechar o navegador

*** Test Cases ***
# Parte do CT 1
CT1 - Nova solicitação sem comprovante
    Fazer login como estudante
    Acessar minhas solicitações
    Acessar formulário de nova solicitação
    Preencher dados da solicitação sem anexo
    Salvar solicitação
    Validar aviso de anexo obrigatório

# Parte do CT 2
CT2 - Nova solicitação com mais de um comprovante
    Fazer login como estudante
    Acessar minhas solicitações
    Acessar formulário de nova solicitação
    Preencher dados da solicitação com múltiplos anexos
    Salvar solicitação
    Validar solicitação salva com sucesso

# Parte do CT 3
CT3 - Excluir uma solicitação pendente
    Fazer login como estudante
    Acessar minhas solicitações
    Excluir solicitação pendente
    Validar solicitação excluída

# Parte do CT 4
CT4 - Excluir uma solicitação aprovada
    Fazer login como estudante
    Acessar minhas solicitações
    Excluir solicitação aprovada
    Validar erro ao excluir solicitação aprovada

# Parte do CT 5
CT5 - Alterar uma solicitação aprovada
    Fazer login como estudante
    Acessar minhas solicitações
    Clicar em alterar solicitação aprovada
    Validar aviso de bloqueio de alteração
