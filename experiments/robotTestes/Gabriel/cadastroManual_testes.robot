*** Settings ***
Resource          cadastroManual_resources.robot

Test Setup        Abrir o navegador
Test Teardown     Fechar o navegador

*** Test Cases ***
# Parte do CT 1
CT1 - Insererir data invalida
    Fazer login como coordenador
    Acessar meus manuais
    Acessar formulário de novo manual
    Preencher dados do manual com data inválida
    Salvar manual
    Validar aviso de data inválida

# Parte do CT 2
CT2 - Insererir valor de horas objetivo invalido
    Fazer login como coordenador
    Acessar meus manuais
    Acessar formulário de novo manual
    Preencher dados do manual com horas inválidas
    Salvar manual
    Validar aviso de horas inválidas

# Parte do CT 3
CT3 - Insererir valor de pontos máximos superior a Horas objetivo do manual
    Fazer login como coordenador
    Acessar meus manuais
    Acessar formulário de novo manual
    Preencher dados do manual com dados validos
    Salvar manual com sucesso
    Acessar minhas categorias
    Acessar formulário de nova categoria
    Preencher dados da categoria com pontos maximos maiores que horas objetivo do manual
    Salvar categoria
    Validar categoria com pontos maximos maiores que horas objetivo do manual

# Parte do CT 4
CT4 - Insererir valor de pontos máximos inválido
    Fazer login como coordenador
    Acessar meus manuais
    Acessar minhas categorias
    Acessar formulário de nova categoria
    Preencher dados da categoria com pontos maximos invalidos
    Salvar categoria
    Validar erro ao inserir pontos maximos invalidos

# Parte do CT 5
CT5 - Insererir valor de limite de horas superior a pontos máximos da categoria
    Fazer login como coordenador
    Acessar meus manuais
    Acessar minhas categorias
    Acessar minhas subcategorias
    Acessar formulário de nova subcategoria
    preencher dados da subcategoria com limite de horas maior que pontos maximos da categoria
    Salvar subcategoria
    Validar aviso de limite de horas superior a pontos máximos da categoria
