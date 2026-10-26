package ash.view;

import ash.DadosSistema;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.layout.BorderPane;

public class TelaEstudante extends TabPane {

    public TelaEstudante() {
        this(DadosSistema.getInstancia());
    }

    public TelaEstudante(DadosSistema dados) {
        // Consultando o banco de dados via Singleton DadosSistema
        TelaCadastro telaSolicitacao = new TelaCadastro(
                "Minhas Solicitações de Horas",
                dados,
                dados.getSolicitacao(),
                "Solicitacao"
        );

        // Adicionamos as telas como abas neste TabPane
        this.getTabs().add(criarAba("Solicitações", telaSolicitacao));
    }

    private Tab criarAba(String titulo, BorderPane conteudo) {
        Tab aba = new Tab(titulo);
        aba.setContent(conteudo);
        aba.setClosable(false); // Impede que o usuário feche a aba sem querer
        return aba;
    }
}
