# Academic Supplementary Hours (ASH)

Esse repositório armazena um projeto extendido realizado na PUCPR.

## Sobre o Projeto

O Academic Supplementary Hours (A.S.H.), é um futuro sistema integrado, com o objetivo de centralizar as informações e funcionalidades necessárias, para tornar mais eficiênte o processo de validação de horas complementares das universidades. 

Até o momento, o projeto está se baseando completamente no sistema da PUCPR, contando com um diferencial de um cálculo automático baseado no manual de cada curso.

A implementacao principal esta em PHP, HTML e JavaScript, com banco de dados definido em SQL. Por hora, o projeto foi testado através do XAMPP.

O projeto ainda não está na sua fase final, e pretendemos seguir com o projeto até o final do curso.

## Estrutura do Repositório

> [!NOTE]
> Essa organização de pastas pode sofrer alterações futuras.

```text
.
+-- app/
|   +-- ash/                  # Implementação principal do sistema A.S.H.
+-- docs/
|   +-- artifacts/            # Documentos, diagramas, referencias e exemplos do projeto
+-- experiments/
    +-- poo-crud-arquivos/    # Implementação alternativa
```

- `app/ash`: codigo-fonte da implementação principal em PHP, HTML, CSS/JS e o script SQL do banco.
- `docs/artifacts`: PDFs, diagramas, referências e materiais de apoio do projeto.
- `experiments/poo-crud-arquivos`: uma implementação diferente do projeto realizada em JavaFX para a matéria de Programação Orientada a Objetos.

## Como executar

1. Instale e abra o XAMPP.
2. Coloque a pasta `app/ash` dentro da pasta `htdocs`.
3. Importe o arquivo `app/ash/banco.sql` no phpMyAdmin.
4. Confira os dados do banco em `app/ash/z_php/conexao.php`.
5. Acesse o projeto pelo navegador.

## Contribuidores

| Nome | GitHub |
| --- | --- |
| Bruno da Costa Mattos Bonacordi | [@Brun0oo7](https://github.com/Brun0oo7) |
| Daniel de Castro Felix | [@danielschmetterling](https://github.com/danielschmetterling) |
| Gabriel Teodoro da Silva | [@GTeodoroS](https://github.com/GTeodoroS) |
| Mateus Canatto Campos | [@mateus-canatto](https://github.com/mateus-canatto) |
| Murilo Caxambu Monteiro | [@Murilo-Caxambu](https://github.com/Murilo-Caxambu) |

## Ex-Contribuidores

| Nome | GitHub |
| --- | --- |
| Gianluca Capote | [@DevGianluca](https://github.com/DevGianluca) |
