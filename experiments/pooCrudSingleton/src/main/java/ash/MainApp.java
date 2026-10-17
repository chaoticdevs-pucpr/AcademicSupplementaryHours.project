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

    @Override
    public void start(Stage stage) {
        this.janela = stage;

        janela.setTitle("A.S.H. - Sistema de Horas Complementares");
        mostrarLogin();
        janela.show();
    }

    public void mostrarLogin() {
        TelaLogin telaLogin = new TelaLogin((tipoUsuario, emailLogado) -> {

            if (tipoUsuario.equals("Administrador")) {
                mostrarSistemaAdmin(emailLogado);
            }
            else if (tipoUsuario.equals("Estudante")) {
                mostrarSistemaEstudante(emailLogado);
            }
            else if (tipoUsuario.equals("Coordenador")) {
                mostrarSistemaCoordenador(emailLogado);
            }
            else if (tipoUsuario.equals("Professor Validador")) {
                mostrarSistemaProfessorValidador(emailLogado);
            }

        });

        janela.setScene(telaLogin.getCena());
    }

    // --- TELA DO SISTEMA ADMIN ---
    public void mostrarSistemaAdmin(String emailLogado) {
        TabPane abas = new TabPane();

        // Obtém as listas diretamente pelo Singleton DadosSistema
        abas.getTabs().add(criarAba("Cursos", new TelaCadastro("Cadastro de Cursos", DadosSistema.getInstancia().getCursos(), "Curso")));
        abas.getTabs().add(criarAba("Turmas", new TelaCadastro("Cadastro de Turmas", DadosSistema.getInstancia().getTurmas(), "Turma")));
        abas.getTabs().add(criarAba("Coordenadores", new TelaCadastro("Cadastro de Coordenadores", DadosSistema.getInstancia().getCoordenadores(), "Coordenador")));
        abas.getTabs().add(criarAba("Estudantes", new TelaCadastro("Cadastro de Estudantes", DadosSistema.getInstancia().getEstudantes(), "Estudante")));

        Label logado = new Label("Logado como Administrador: " + emailLogado);
        Button btnSair = new Button("Sair");

        // Volta para a tela de login ao clicar em Sair
        btnSair.setOnAction(e -> mostrarLogin());

        HBox topo = new HBox(10, logado, btnSair);
        topo.setPadding(new Insets(10));
        topo.setAlignment(Pos.CENTER_RIGHT);

        BorderPane tela = new BorderPane();
        tela.setTop(topo);
        tela.setCenter(abas);

        janela.setScene(new Scene(tela, 900, 600));
    }

    // --- TELA DO ESTUDANTE ---
    public void mostrarSistemaEstudante(String emailLogado) {
        ash.view.TelaEstudante telaEstudante = new ash.view.TelaEstudante();

        Label logado = new Label("Logado como Estudante: " + emailLogado);
        Button btnSair = new Button("Sair");

        btnSair.setOnAction(e -> mostrarLogin());

        HBox topo = new HBox(10, logado, btnSair);
        topo.setPadding(new Insets(10));
        topo.setAlignment(Pos.CENTER_RIGHT);

        BorderPane tela = new BorderPane();
        tela.setTop(topo);
        tela.setCenter(telaEstudante);

        janela.setScene(new Scene(tela, 900, 600));
    }

    // --- TELA DO COORDENADOR ---
    public void mostrarSistemaCoordenador(String emailLogado) {
        ash.view.TelaCoordenador telaCoordenador = new ash.view.TelaCoordenador();

        Label logado = new Label("Logado como Coordenador: " + emailLogado);
        Button btnSair = new Button("Sair");

        btnSair.setOnAction(e -> mostrarLogin());

        HBox topo = new HBox(10, logado, btnSair);
        topo.setPadding(new Insets(10));
        topo.setAlignment(Pos.CENTER_RIGHT);

        BorderPane tela = new BorderPane();
        tela.setTop(topo);
        tela.setCenter(telaCoordenador);

        janela.setScene(new Scene(tela, 900, 600));
    }

    // --- TELA DO PROFESSOR VALIDADOR ---
    public void mostrarSistemaProfessorValidador(String emailLogado) {
        ash.view.TelaProfessorValidador telaProfessor = new ash.view.TelaProfessorValidador();

        Label logado = new Label("Logado como Professor Validador: " + emailLogado);
        Button btnSair = new Button("Sair");

        btnSair.setOnAction(e -> mostrarLogin());

        HBox topo = new HBox(10, logado, btnSair);
        topo.setPadding(new Insets(10));
        topo.setAlignment(Pos.CENTER_RIGHT);

        BorderPane tela = new BorderPane();
        tela.setTop(topo);
        tela.setCenter(telaProfessor);

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