package ash.view;

import ash.DadosSistema;
import ash.model.Administrador;
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

import java.util.function.Consumer;

public class TelaLogin {
    private Scene cena;

    public TelaLogin(DadosSistema dados, Consumer<String> aoLogarSucesso) {

        // titulo do ash
        Label titulo = new Label("A.S.H.");
        // Mudando a fonte nativamente: Tipo, Peso e Tamanho
        titulo.setFont(Font.font("System", FontWeight.EXTRA_BOLD, 36));

        Label subtitulo = new Label("Login do Sistema");
        subtitulo.setFont(Font.font("System", FontWeight.NORMAL, 16));

        VBox cabecalho = new VBox(5, titulo, subtitulo);
        cabecalho.setAlignment(Pos.CENTER);
        cabecalho.setPadding(new Insets(0, 0, 20, 0)); // Espaço extra embaixo do cabeçalho

        // formulario com email e senha
        Label lblEmail = new Label("E-mail:");
        lblEmail.setFont(Font.font("System", FontWeight.BOLD, 14));

        TextField campoEmail = new TextField();
        campoEmail.setPromptText("Ex: admin@sistema.com.br");
        campoEmail.setPrefWidth(220); // Deixa a caixa de texto mais larga
        campoEmail.setPrefHeight(30); // Deixa a caixa de texto mais alta

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

        // botao
        Button btnEntrar = new Button("Entrar");
        btnEntrar.setFont(Font.font("System", FontWeight.BOLD, 14));
        btnEntrar.setPrefWidth(120); // Alarga o botão
        btnEntrar.setPrefHeight(40); // Aumenta a altura para destacar

        VBox boxBotao = new VBox(btnEntrar);
        boxBotao.setAlignment(Pos.CENTER);
        boxBotao.setPadding(new Insets(20, 0, 0, 0));

        // montagem final
        VBox layout = new VBox(10, cabecalho, formulario, boxBotao);
        layout.setPadding(new Insets(40));
        layout.setAlignment(Pos.CENTER);

        btnEntrar.setOnAction(e -> {
            String emailDigitado = campoEmail.getText().trim();
            String senhaDigitada = campoSenha.getText().trim();

            if (validarLogin(dados, emailDigitado, senhaDigitada)) {
                aoLogarSucesso.accept(emailDigitado);
            } else {
                mostrarErro("E-mail ou senha inválidos.");
            }
        });

        this.cena = new Scene(layout, 450, 400);
    }

    public Scene getCena() {
        return cena;
    }

    private boolean validarLogin(DadosSistema dados, String email, String senha) {
        for (Administrador admin : dados.getAdministradores()) {
            if (admin.getEmail().equalsIgnoreCase(email) && admin.getSenha().equals(senha)) {
                return true;
            }
        }
        return false;
    }

    private void mostrarErro(String texto) {
        Alert alerta = new Alert(Alert.AlertType.ERROR);
        alerta.setHeaderText("Erro de Autenticação");
        alerta.setContentText(texto);
        alerta.showAndWait();
    }
}