package ash.view;

import ash.DadosSistema;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.layout.BorderPane;

public class TelaCoordenador extends TabPane {

    public TelaCoordenador() {
        this(DadosSistema.getInstancia());
    }

    public TelaCoordenador(DadosSistema dados) {
        TelaCadastro telaProfessorValidador = new TelaCadastro(
                "Criar Professor validador", dados, dados.getProfessorValidador(), "Professor Validador");
        TelaCadastro telaManual = new TelaCadastro(
                "Cadastrar manual de horas complementares", dados, dados.getManual(), "Manual");
        TelaCadastro telaCategorias = new TelaCadastro(
                "Cadastrar categoria", dados, dados.getCategorias(), "Categorias");
        TelaCadastro telaSubcategorias = new TelaCadastro(
                "Cadastrar Subcategoria", dados, dados.getSubcategorias(), "Subcategoria");
        TelaCadastro telaJustificativa = new TelaCadastro(
                "Aceitar/Cadastrar Justificativa", dados, dados.getJustificativasAceite(), "JustificativaAceite");

        this.getTabs().add(criarAba("Manual", telaManual));
        this.getTabs().add(criarAba("Categorias", telaCategorias));
        this.getTabs().add(criarAba("Subcategorias", telaSubcategorias));
        this.getTabs().add(criarAba("Professor Validador", telaProfessorValidador));
        this.getTabs().add(criarAba("Justificativas", telaJustificativa));
    }

    private Tab criarAba(String titulo, BorderPane conteudo) {
        Tab aba = new Tab(titulo);
        aba.setContent(conteudo);
        aba.setClosable(false); // Impede que o usuário feche a aba sem querer
        return aba;
    }
}
