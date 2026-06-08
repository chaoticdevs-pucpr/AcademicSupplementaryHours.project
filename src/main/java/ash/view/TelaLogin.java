package ash.view;

import ash.DadosSistema;
import ash.model.Administrador;
import ash.model.CadastroItem;
import ash.model.Coordenador;
import ash.model.Estudante;

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

// Mudamos de Consumer para BiConsumer para enviar o TIPO DE USUÁRIO e o EMAIL
import java.util.function.BiConsumer;

public class TelaLogin {
    private Scene cena;

    public TelaLogin(DadosSistema dados, BiConsumer<String, String> aoLogarSucesso) {

        // titulo do ash
        Label titulo = new Label("A.S.H.");
        titulo.setFont(Font.font("System", FontWeight.EXTRA_BOLD, 36));

        Label subtitulo = new Label("Login do Sistema");
        subtitulo.setFont(Font.font("System", FontWeight.NORMAL, 16));

        VBox cabecalho = new VBox(5, titulo, subtitulo);
        cabecalho.setAlignment(Pos.CENTER);
        cabecalho.setPadding(new Insets(0, 0, 20, 0));

        // formulario com email e senha
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

        // botao
        Button btnEntrar = new Button("Entrar");
        btnEntrar.setFont(Font.font("System", FontWeight.BOLD, 14));
        btnEntrar.setPrefWidth(120);
        btnEntrar.setPrefHeight(40);

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

            // Agora o método retorna o tipo de quem logou (em vez de true/false)
            String tipoUsuario = validarLogin(dados, emailDigitado, senhaDigitada);

            if (tipoUsuario != null) {
                // Passa para frente o tipo de usuário e o email
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

    // <-- MUDANÇA AQUI: Agora retorna uma String com o tipo de usuário
    private String validarLogin(DadosSistema dados, String email, String senha) {

        // 1. Verifica Administradores
        for (Administrador admin : dados.getAdministradores()) {
            if (admin.getEmail().equalsIgnoreCase(email) && admin.getSenha().equals(senha)) {
                return "Administrador";
            }
        }

        // 2. Verifica Estudantes (fazemos um "cast" para enxergar os métodos getEmail)
        if (dados.getEstudantes() != null) {
            for (CadastroItem item : dados.getEstudantes()) {
                Estudante estudante = (Estudante) item;
                if (estudante.getEmail().equalsIgnoreCase(email) && estudante.getSenha().equals(senha)) {
                    return "Estudante";
                }
            }
        }

        // 3. Verifica Coordenadores
        if (dados.getCoordenadores() != null) {
            for (CadastroItem item : dados.getCoordenadores()) {
                Coordenador coordenador = (Coordenador) item;
                if (coordenador.getEmail().equalsIgnoreCase(email) && coordenador.getSenha().equals(senha)) {
                    return "Coordenador";
                }
            }
        }

        // Se o loop terminar e não achar ninguém:
        return null;
    }

    private void mostrarErro(String texto) {
        Alert alerta = new Alert(Alert.AlertType.ERROR);
        alerta.setHeaderText("Erro de Autenticação");
        alerta.setContentText(texto);
        alerta.showAndWait();
    }
}