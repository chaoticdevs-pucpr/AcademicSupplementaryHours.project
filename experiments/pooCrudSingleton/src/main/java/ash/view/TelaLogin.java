package ash.view;

import ash.DadosSistema;

import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

import java.util.function.BiConsumer;

public class TelaLogin {
    private Scene cena;

    public TelaLogin(BiConsumer<String, String> aoLogarSucesso) {
        this(DadosSistema.getInstancia(), aoLogarSucesso);
    }

    public TelaLogin(DadosSistema dados, BiConsumer<String, String> aoLogarSucesso) {
        // Titulo do ASH
        Label titulo = new Label("A.S.H.");
        titulo.setFont(Font.font("System", FontWeight.EXTRA_BOLD, 36));

        Label subtitulo = new Label("Login do Sistema");
        subtitulo.setFont(Font.font("System", FontWeight.NORMAL, 16));

        VBox cabecalho = new VBox(5, titulo, subtitulo);
        cabecalho.setAlignment(Pos.CENTER);
        cabecalho.setPadding(new Insets(0, 0, 20, 0));

        // Formulario com email e senha
        Label lblEmail = new Label("E-mail:");
        lblEmail.setFont(Font.font("System", FontWeight.BOLD, 14));

        TextField campoEmail = new TextField();
        campoEmail.setPromptText("Ex: admin@sistema.com.br");
        campoEmail.setPrefWidth(220);
        campoEmail.setPrefHeight(30);

        Label lblSenha = new Label("Senha:");
        lblSenha.setFont(Font.font("System", FontWeight.BOLD, 14));

        PasswordField campoSenha = new PasswordField();
        campoSenha.setPromptText("Sua senha");
        campoSenha.setPrefWidth(220);
        campoSenha.setPrefHeight(30);

        GridPane formulario = new GridPane();
        formulario.setHgap(10);
        formulario.setVgap(15);
        formulario.setAlignment(Pos.CENTER);

        formulario.add(lblEmail, 0, 0);
        formulario.add(campoEmail, 1, 0);
        formulario.add(lblSenha, 0, 1);
        formulario.add(campoSenha, 1, 1);

        // Botao
        Button btnEntrar = new Button("Entrar");
        btnEntrar.setFont(Font.font("System", FontWeight.BOLD, 14));
        btnEntrar.setPrefWidth(120);
        btnEntrar.setPrefHeight(40);

        VBox boxBotao = new VBox(btnEntrar);
        boxBotao.setAlignment(Pos.CENTER);
        boxBotao.setPadding(new Insets(20, 0, 0, 0));

        // Montagem final
        VBox layout = new VBox(10, cabecalho, formulario, boxBotao);
        layout.setPadding(new Insets(40));
        layout.setAlignment(Pos.CENTER);

        btnEntrar.setOnAction(e -> {
            String emailDigitado = campoEmail.getText().trim();
            String senhaDigitada = campoSenha.getText().trim();

            // Busca no banco de dados via Singleton
            String tipoUsuario = validarLogin(emailDigitado, senhaDigitada);

            if (tipoUsuario != null) {
                aoLogarSucesso.accept(tipoUsuario, emailDigitado);
            } else {
                mostrarErro("E-mail ou senha inválidos.");
            }
        });

        this.cena = new Scene(layout, 450, 400);
    }

    public Scene getCena() {
        return cena;
    }

    /**
     * Utiliza o padrão Singleton DadosSistema para buscar e autenticar o usuário.
     */
    private String validarLogin(String email, String senha) {
        return DadosSistema.getInstancia().autenticarUsuario(email, senha);
    }

    private void mostrarErro(String texto) {
        Alert alerta = new Alert(Alert.AlertType.ERROR);
        alerta.setHeaderText("Erro de Autenticação");
        alerta.setContentText(texto);
        alerta.showAndWait();
    }
}