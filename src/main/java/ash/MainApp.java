package ash;

import ash.view.TelaCadastro;
import ash.view.TelaLogin;
import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.stage.Stage;

public class MainApp extends Application {
    private Stage janela;
    private DadosSistema dados;

    @Override
    public void start(Stage stage) {
        this.janela = stage;
        this.dados = ArquivoDados.carregar(); // Puxa os dados salvos

        janela.setTitle("A.S.H. - Sistema de Horas Complementares");
        mostrarLogin();
        janela.show();
    }

    public void mostrarLogin() {
        // Passa os dados e a instrução do que fazer quando o login for validado
        TelaLogin telaLogin = new TelaLogin(dados, emailLogado -> {
            mostrarSistemaAdmin(emailLogado);
        });

        janela.setScene(telaLogin.getCena());
    }

    // --- TELA OFICIAL DO SISTEMA ---
    public void mostrarSistemaAdmin(String emailLogado) {
        TabPane abas = new TabPane();

        // Daniel passou por aqui
        abas.getTabs().add(criarAba("Cursos", new TelaCadastro("Cadastro de Cursos", dados, dados.getCursos(), "Curso")));
        abas.getTabs().add(criarAba("Turmas", new TelaCadastro("Cadastro de Turmas", dados, dados.getTurmas(), "Turma")));

        // A mágica acontece aqui: Instanciamos a mesma TelaCadastro, mas passando listas diferentes!
        abas.getTabs().add(criarAba("Coordenadores", new TelaCadastro("Cadastro de Coordenadores", dados, dados.getCoordenadores(), "Coordenador")));
        abas.getTabs().add(criarAba("Estudantes", new TelaCadastro("Cadastro de Estudantes", dados, dados.getEstudantes(), "Estudante")));

        Label logado = new Label("Logado como Administrador: " + emailLogado);
        Button btnSair = new Button("Sair");

        // Volta para a tela de login ao clicar em Sair
        btnSair.setOnAction(e -> mostrarLogin());

        HBox topo = new HBox(10, logado, btnSair);
        topo.setPadding(new Insets(10));
        topo.setAlignment(Pos.CENTER_RIGHT);

        BorderPane tela = new BorderPane();
        tela.setTop(topo);
        tela.setCenter(abas); // Coloca as abas no centro da tela

        // Aumentei o tamanho da tela para o formulário caber com folga
        janela.setScene(new Scene(tela, 900, 600));
    }

    private Tab criarAba(String titulo, BorderPane conteudo) {
        Tab aba = new Tab(titulo);
        aba.setContent(conteudo);
        aba.setClosable(false);
        return aba;
    }

    public static void main(String[] args) {
        launch(args);
    }
}