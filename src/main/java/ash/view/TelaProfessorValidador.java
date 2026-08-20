package ash.view;

import ash.DadosSistema;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.layout.BorderPane;

public class TelaProfessorValidador extends TabPane {

    public TelaProfessorValidador(DadosSistema dados) {

        TelaCadastro telaVerSolicitacoes = new TelaCadastro(
                "Visualizar Solicitações dos Alunos",
                dados,
                dados.getSolicitacao(),
                "Solicitacao"
        );

        TelaCadastro telaJustificativa = new TelaCadastro(
                "Avaliar/Cadastrar Justificativas",
                dados,
                dados.getJustificativasAceite(),
                "JustificativaAceite"
        );

        this.getTabs().add(criarAba("Solicitações Pendentes", telaVerSolicitacoes));
        this.getTabs().add(criarAba("Dar Veredito (Justificativa)", telaJustificativa));
    }

    private Tab criarAba(String titulo, BorderPane conteudo) {
        Tab aba = new Tab(titulo);
        aba.setContent(conteudo);
        aba.setClosable(false); // Impede que o usuário feche a aba sem querer
        return aba;
    }
}