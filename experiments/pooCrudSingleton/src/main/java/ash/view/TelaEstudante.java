package ash.view;

import ash.DadosSistema;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.layout.BorderPane;

public class TelaEstudante extends TabPane {

    public TelaEstudante(DadosSistema dados) {
        // A mágica: Reaproveitamos a SUA TelaCadastro para gerar as duas telas do estudante!
        TelaCadastro telaSolicitacao = new TelaCadastro("Minhas Solicitações de Horas", dados, dados.getSolicitacao(), "Solicitacao");
        TelaCadastro telaSugestao = new TelaCadastro("Minhas Sugestões", dados, dados.getSugestao(), "Sugestao");

        // Adicionamos as telas como abas neste TabPane
        this.getTabs().add(criarAba("Solicitações", telaSolicitacao));
        this.getTabs().add(criarAba("Sugestões", telaSugestao));
    }

    private Tab criarAba(String titulo, BorderPane conteudo) {
        Tab aba = new Tab(titulo);
        aba.setContent(conteudo);
        aba.setClosable(false); // Impede que o usuário feche a aba sem querer
        return aba;
    }
}