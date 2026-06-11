package ash.view;

import ash.DadosSistema;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.layout.BorderPane;

public class TelaCoordenador extends TabPane {

    public TelaCoordenador(DadosSistema dados) {
        TelaCadastro telaProfessorValidador = new TelaCadastro("Criar Professor validador", dados, dados.getProfessorValidador(), "Professor Validador");

        this.getTabs().add(criarAba("Professor Vaidador", telaProfessorValidador));
    }

    private Tab criarAba(String titulo, BorderPane conteudo) {
        Tab aba = new Tab(titulo);
        aba.setContent(conteudo);
        aba.setClosable(false); // Impede que o usuário feche a aba sem querer
        return aba;
    }
}