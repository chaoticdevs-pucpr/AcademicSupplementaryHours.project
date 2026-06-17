package ash.view;

import ash.ArquivoDados;
import ash.DadosSistema;
import ash.model.*;

// Daniel passou por aqui
import ash.model.Curso;
import ash.model.Turma;

import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.geometry.Insets;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;

import java.util.ArrayList;

public class TelaCadastro extends BorderPane {
    private DadosSistema dados;
    private ArrayList<CadastroItem> lista;
    private String tipo;

    private TableView<CadastroItem> tabela = new TableView<>();
    private TextField[] campos;

    public TelaCadastro(String titulo, DadosSistema dados, ArrayList<CadastroItem> lista, String tipo) {
        this.dados = dados;
        this.lista = lista;
        this.tipo = tipo;

        setPadding(new Insets(15));

        Label labelTitulo = new Label(titulo);
        labelTitulo.setStyle("-fx-font-size: 20px; -fx-font-weight: bold;");

        BorderPane.setMargin(labelTitulo, new Insets(0, 0, 15, 0));
        setTop(labelTitulo);

        configurarColunasDaTabela();

        tabela.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);

        setLeft(criarFormulario());

        setCenter(tabela);

        BorderPane.setMargin(tabela, new Insets(0, 0, 0, 20));
        tabela.getSelectionModel().selectedItemProperty().addListener((obs, antigo, selecionado) -> preencherTela(selecionado));
        atualizarLista();
    }

    private void configurarColunasDaTabela() {
        CadastroItem exemplo = criarObjeto();
        assert exemplo != null;
        String[] nomesDasColunas = exemplo.nomeCampos();

        for (int i = 0; i < nomesDasColunas.length; i++) {
            TableColumn<CadastroItem, String> coluna = new TableColumn<>(nomesDasColunas[i]);

            final int index = i;
            coluna.setCellValueFactory(celula -> {
                String[] valores = celula.getValue().valoresCampos();
                if (index < valores.length && valores[index] != null) {
                    return new SimpleStringProperty(valores[index]);
                }
                return new SimpleStringProperty("");
            });

            tabela.getColumns().add(coluna);
        }
    }

    private GridPane criarFormulario() {
        CadastroItem exemplo = criarObjeto();
        String[] nomes = exemplo.nomeCampos();
        campos = new TextField[nomes.length];

        GridPane painel = new GridPane();

        painel.setHgap(10);
        painel.setVgap(10);

        for (int i = 0; i < nomes.length; i++) {
            Label label = new Label(nomes[i] + ":");
            TextField campo = new TextField();
            campos[i] = campo;
            painel.add(label, 0, i);
            painel.add(campo, 1, i);
        }

        Button botaoNovo = new Button("Novo");
        Button botaoSalvar = new Button("Salvar");
        Button botaoExcluir = new Button("Excluir");

        botaoNovo.setOnAction(e -> limparTela());
        botaoSalvar.setOnAction(e -> salvarRegistro());
        botaoExcluir.setOnAction(e -> excluirRegistro());

        HBox botoes = new HBox(10, botaoNovo, botaoSalvar, botaoExcluir);

        GridPane.setMargin(botoes, new Insets(10, 0, 0, 0));
        painel.add(botoes, 1, nomes.length);

        return painel;
    }

    private CadastroItem criarObjeto() {
        if (tipo.equals("Curso")) return new Curso();
        if (tipo.equals("Turma")) return new Turma();
        if (tipo.equals("Manual")) return new Manual();
        if (tipo.equals("Categorias")) return new Categorias();
        if (tipo.equals("Coordenador")) return new Coordenador();
        if (tipo.equals("Estudante")) return new Estudante();
        if (tipo.equals("Solicitacao")) return new Solicitacao();
        if (tipo.equals("Sugestao")) return new Sugestao();
        if (tipo.equals("Professor Validador")) return new ProfessorValidador();
        if (tipo.equals("Evento")) return new Evento();
        if (tipo.equals("Subcategoria")) return new Subcategoria();
        if (tipo.equals("JustificativaAceite")) return new JustificativaAceite();
        return null;
    }

    private void salvarRegistro() {
        try {
            String[] valores = new String[campos.length];
            CadastroItem selecionado = tabela.getSelectionModel().getSelectedItem();
            CadastroItem item;
            boolean novoRegistro = false;

            if (selecionado == null) {
                item = criarObjeto();
                item.setId(dados.proximoId(lista));
                novoRegistro = true;
            } else {
                item = selecionado;
            }

            for (int i = 0; i < campos.length; i++) {
                valores[i] = campos[i].getText().trim();
                if (valores[i].isEmpty()) {
                    throw new Exception("Preencha todos os campos.");
                }
                validarCampo(item.nomeCampos()[i], valores[i]);
            }

            item.preencherCampos(valores);
            if (novoRegistro) {
                lista.add(item);
            }
            ArquivoDados.salvar(dados);
            atualizarLista();
            limparTela();
            mostrarMensagem("Registro salvo com sucesso.");
        } catch (Exception erro) {
            mostrarErro(erro.getMessage());
        }
    }

    private void excluirRegistro() {
        try {
            CadastroItem selecionado = tabela.getSelectionModel().getSelectedItem();
            if (selecionado == null) {
                throw new Exception("Selecione um registro para excluir.");
            }

            lista.remove(selecionado);
            ArquivoDados.salvar(dados);
            atualizarLista();
            limparTela();
            mostrarMensagem("Registro excluido com sucesso.");
        } catch (Exception erro) {
            mostrarErro(erro.getMessage());
        }
    }

    private void preencherTela(CadastroItem item) {
        if (item == null) {
            return;
        }

        String[] valores = item.valoresCampos();
        for (int i = 0; i < campos.length; i++) {
            campos[i].setText(valores[i]);
        }
    }

    private void limparTela() {
        tabela.getSelectionModel().clearSelection();
        for (TextField campo : campos) {
            campo.clear();
        }
    }

    private void atualizarLista() {
        tabela.setItems(FXCollections.observableArrayList(lista));
    }

    private void validarCampo(String nomeCampo, String valor) throws Exception {
        String nome = nomeCampo.toLowerCase();

        if (nome.contains("cndb")) {
            try {
                Integer.parseInt(valor);
            } catch (NumberFormatException erro) {
                throw new Exception("O campo " + nomeCampo + " deve ser numérico.");
            }
        }

        if (nome.contains("horas")) {
            try {
                Double.parseDouble(valor);
            } catch (NumberFormatException erro) {
                throw new Exception("O campo " + nomeCampo + " deve ser um número.");
            }
        }

        if (nome.equals("status") && tipo.equals("JustificativaAceite")) {
            if (!valor.equalsIgnoreCase("Aceito") && !valor.equalsIgnoreCase("Rejeitado")) {
                throw new Exception("Status deve ser 'Aceito' ou 'Rejeitado'.");
            }
        }
    }

    private void mostrarMensagem(String texto) {
        Alert alerta = new Alert(Alert.AlertType.INFORMATION);
        alerta.setHeaderText(null);
        alerta.setContentText(texto);
        alerta.showAndWait();
    }

    private void mostrarErro(String texto) {
        Alert alerta = new Alert(Alert.AlertType.ERROR);
        alerta.setHeaderText(null);
        alerta.setContentText(texto);
        alerta.showAndWait();
    }
}