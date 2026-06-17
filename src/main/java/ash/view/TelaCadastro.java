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
import javafx.scene.control.ComboBox;
import javafx.scene.control.Control;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.control.TextFormatter;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;

import java.util.ArrayList;

public class TelaCadastro extends BorderPane {
    private DadosSistema dados;
    private ArrayList<CadastroItem> lista;
    private String tipo;

    private TableView<CadastroItem> tabela = new TableView<>();
    private Control[] campos;

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
        campos = new Control[nomes.length];

        GridPane painel = new GridPane();
        painel.setHgap(10);
        painel.setVgap(10);

        // VARIÁVEL CHAVE: Guarda a referência da caixa de curso para a turma poder ler depois
        ComboBox<String> referenciaComboCurso = null;

        for (int i = 0; i < nomes.length; i++) {
            Label label = new Label(nomes[i] + ":");
            String nomeDoCampo = nomes[i].toLowerCase();

            // --- LÓGICA DO COMBOBOX DE CURSO ---
            if (nomeDoCampo.equals("curso") || nomeDoCampo.equals("cursos")) {
                ComboBox<String> comboBoxCurso = new ComboBox<>();
                comboBoxCurso.setPromptText("Selecione um curso...");
                referenciaComboCurso = comboBoxCurso; // Salva a caixa na variável chave!

                comboBoxCurso.setOnShowing(event -> {
                    comboBoxCurso.getItems().clear();
                    for (CadastroItem cursoCadastrado : dados.getCursos()) {
                        String[] nomesDosCampos = cursoCadastrado.nomeCampos();
                        String[] valoresDoCurso = cursoCadastrado.valoresCampos();

                        int indexDoNome = -1;
                        for (int j = 0; j < nomesDosCampos.length; j++) {
                            if (nomesDosCampos[j].toLowerCase().contains("nome") || nomesDosCampos[j].toLowerCase().equals("curso")) {
                                indexDoNome = j;
                                break;
                            }
                        }

                        if (indexDoNome != -1 && valoresDoCurso.length > indexDoNome) {
                            comboBoxCurso.getItems().add(valoresDoCurso[indexDoNome]);
                        } else if (valoresDoCurso.length > 0) {
                            comboBoxCurso.getItems().add(valoresDoCurso[0]);
                        }
                    }
                });

                campos[i] = comboBoxCurso;
                painel.add(label, 0, i);
                painel.add(comboBoxCurso, 1, i);


            } else if (nomeDoCampo.equals("turma") || nomeDoCampo.equals("turmas")) {
                ComboBox<String> comboBoxTurma = new ComboBox<>();
                comboBoxTurma.setPromptText("Selecione uma turma...");


                final ComboBox<String> comboCursoParaFiltro = referenciaComboCurso;

                comboBoxTurma.setOnShowing(event -> {
                    comboBoxTurma.getItems().clear();

                    // Descobre qual curso o usuário escolheu na caixa de cima
                    String cursoSelecionado = (comboCursoParaFiltro != null) ? comboCursoParaFiltro.getValue() : null;

                    for (CadastroItem turmaCadastrada : dados.getTurmas()) {
                        String[] nomesDosCampos = turmaCadastrada.nomeCampos();
                        String[] valoresDaTurma = turmaCadastrada.valoresCampos();

                        int indexDoNome = -1;
                        int indexDoCursoNaTurma = -1;

                        // Procura onde está o Nome da Turma e onde está o Curso atrelado a ela
                        for (int j = 0; j < nomesDosCampos.length; j++) {
                            if (nomesDosCampos[j].toLowerCase().contains("nome") || nomesDosCampos[j].toLowerCase().equals("turma")) {
                                indexDoNome = j;
                            }
                            if (nomesDosCampos[j].toLowerCase().equals("curso")) {
                                indexDoCursoNaTurma = j;
                            }
                        }


                        boolean pertenceAoCurso = true;
                        if (cursoSelecionado != null && indexDoCursoNaTurma != -1) {
                            if (valoresDaTurma.length > indexDoCursoNaTurma) {
                                pertenceAoCurso = valoresDaTurma[indexDoCursoNaTurma].equals(cursoSelecionado);
                            } else {
                                pertenceAoCurso = false;
                            }
                        }

                        if (pertenceAoCurso) {
                            if (indexDoNome != -1 && valoresDaTurma.length > indexDoNome) {
                                comboBoxTurma.getItems().add(valoresDaTurma[indexDoNome]);
                            } else if (valoresDaTurma.length > 0) {
                                comboBoxTurma.getItems().add(valoresDaTurma[0]);
                            }
                        }
                    }

                    if (comboBoxTurma.getItems().isEmpty() && cursoSelecionado != null) {
                        comboBoxTurma.setPromptText("Nenhuma turma neste curso");
                    } else {
                        comboBoxTurma.setPromptText("Selecione uma turma...");
                    }
                });

                campos[i] = comboBoxTurma;
                painel.add(label, 0, i);
                painel.add(comboBoxTurma, 1, i);

                // --- LÓGICA DO CAMPO DE TEXTO PADRÃO ---
            } else {
                TextField campo = new TextField();

                if (nomeDoCampo.contains("cpf") || nomeDoCampo.contains("número") || nomeDoCampo.contains("numero") || nomeDoCampo.contains("cndb") || nomeDoCampo.contains("telefone") || nomeDoCampo.contains("celular")) {
                    campo.setTextFormatter(new TextFormatter<>(change -> {
                        if (change.getText().matches("[0-9]*")) {
                            return change;
                        }
                        return null;
                    }));
                }

                campos[i] = campo;
                painel.add(label, 0, i);
                painel.add(campo, 1, i);
            }
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
                if (campos[i] instanceof TextField) {
                    valores[i] = ((TextField) campos[i]).getText().trim();
                } else if (campos[i] instanceof ComboBox) {
                    Object valorCombo = ((ComboBox<?>) campos[i]).getValue();
                    valores[i] = valorCombo != null ? valorCombo.toString() : "";
                }

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
            if (campos[i] instanceof TextField) {
                ((TextField) campos[i]).setText(valores[i]);
            } else if (campos[i] instanceof ComboBox) {
                @SuppressWarnings("unchecked")
                ComboBox<String> combo = (ComboBox<String>) campos[i];
                combo.setValue(valores[i]);
            }
        }
    }

    private void limparTela() {
        tabela.getSelectionModel().clearSelection();
        for (Control campo : campos) {
            if (campo instanceof TextField) {
                ((TextField) campo).clear();
            } else if (campo instanceof ComboBox) {
                ((ComboBox<?>) campo).getSelectionModel().clearSelection();
            }
        }
    }

    private void atualizarLista() {
        tabela.setItems(FXCollections.observableArrayList(lista));
        tabela.refresh();
    }

    private void validarCampo(String nomeCampo, String valor) throws Exception {
        String nome = nomeCampo.toLowerCase();

        if (nome.contains("cndb") || nome.contains("número") || nome.contains("numero")) {
            if (!valor.matches("\\d+")) {
                throw new Exception("O campo " + nomeCampo + " deve conter apenas números.");
            }
        }

        if (nome.contains("cpf")) {
            String cpfLimpo = valor.replaceAll("[^0-9]", "");
            if (cpfLimpo.length() != 11) {
                throw new Exception("O CPF digitado é inválido. Ele deve conter exatamente 11 dígitos.");
            }
        }

        if (nome.contains("email") || nome.contains("e-mail")) {
            String regexEmail = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
            if (!valor.matches(regexEmail)) {
                throw new Exception("O formato do e-mail é inválido. Verifique se contém '@' e o domínio.");
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