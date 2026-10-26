package ash.view;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Objects;

import ash.DadosSistema;
import ash.model.CadastroItem;
import ash.model.Categorias;
import ash.model.Coordenador;
import ash.model.Curso;
import ash.model.Estudante;
import ash.model.JustificativaAceite;
import ash.model.Manual;
import ash.model.ProfessorValidador;
import ash.model.Solicitacao;
import ash.model.Subcategoria;
import ash.model.Turma;
import ash.observer.DadosObserver;
import javafx.application.Platform;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.DatePicker;
import javafx.scene.control.Label;
import javafx.scene.control.Spinner;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.control.TextFormatter;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;

public class TelaCadastro extends BorderPane implements DadosObserver {
    private DadosSistema dados;
    private ArrayList<CadastroItem> lista;
    private String tipo;

    private TableView<CadastroItem> tabela = new TableView<>();
    private Node[] campos; 

    public TelaCadastro(String titulo, ArrayList<CadastroItem> lista, String tipo) {
        this(titulo, DadosSistema.getInstancia(), lista, tipo);
    }

    public TelaCadastro(String titulo, DadosSistema dados, ArrayList<CadastroItem> lista, String tipo) {
        this.dados = (dados != null) ? dados : DadosSistema.getInstancia();
        this.lista = lista;
        this.tipo = tipo;

        setPadding(new Insets(15));

        Label labelTitulo = new Label(titulo);
        labelTitulo.setStyle("-fx-font-size: 20px; -fx-font-weight: bold;");

        BorderPane.setMargin(labelTitulo, new Insets(0, 0, 15, 0));
        setTop(labelTitulo);

        configurarColunasDaTabela();

        tabela.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);


        if (!titulo.contains("Visualizar")) {
            setLeft(criarFormulario()); // Adiciona o menu lateral com botões
            BorderPane.setMargin(tabela, new Insets(0, 0, 0, 20)); // Mantém o espaçamento
        } else {
            BorderPane.setMargin(tabela, new Insets(0)); // Tira a margem para a tabela esticar 100% da tela!
        }

        setCenter(tabela);
        tabela.getSelectionModel().selectedItemProperty().addListener((obs, antigo, selecionado) -> preencherTela(selecionado));
        this.dados.registrarObservador(this);
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
        campos = new Node[nomes.length];

        GridPane painel = new GridPane();
        painel.setHgap(10);
        painel.setVgap(10);

        ComboBox<String> referenciaComboCurso = null;
        ComboBox<String> referenciaComboCategoria = null;

        for (int i = 0; i < nomes.length; i++) {
            Label label = new Label(nomes[i] + ":");
            String nomeDoCampo = nomes[i].toLowerCase();

            if (nomeDoCampo.equals("curso") || nomeDoCampo.equals("cursos")) {
                ComboBox<String> comboBoxCurso = new ComboBox<>();
                comboBoxCurso.setPromptText("Selecione um curso...");
                referenciaComboCurso = comboBoxCurso;

                comboBoxCurso.setOnShowing(event -> {
                    comboBoxCurso.getItems().clear();
                    comboBoxCurso.getItems().addAll(dados.buscarNomesCursos());
                });

                campos[i] = comboBoxCurso;
                painel.add(label, 0, i);
                painel.add(comboBoxCurso, 1, i);


                // --- LÓGICA DO COMBOBOX DE TURMA ---
            } else if (nomeDoCampo.equals("turma") || nomeDoCampo.equals("turmas")) {
                ComboBox<String> comboBoxTurma = new ComboBox<>();
                comboBoxTurma.setPromptText("Selecione uma turma...");

                final ComboBox<String> comboCursoParaFiltro = referenciaComboCurso;

                comboBoxTurma.setOnShowing(event -> {
                    comboBoxTurma.getItems().clear();
                    String cursoSelecionado = (comboCursoParaFiltro != null) ? comboCursoParaFiltro.getValue() : null;
                    comboBoxTurma.getItems().addAll(dados.buscarTurmasPorCurso(cursoSelecionado));

                    if (comboBoxTurma.getItems().isEmpty() && cursoSelecionado != null) {
                        comboBoxTurma.setPromptText("Nenhuma turma neste curso");
                    } else {
                        comboBoxTurma.setPromptText("Selecione uma turma...");
                    }
                });

                campos[i] = comboBoxTurma;
                painel.add(label, 0, i);
                painel.add(comboBoxTurma, 1, i);


                // --- LÓGICA DO COMBOBOX DE CATEGORIA ---
            } else if (nomeDoCampo.equals("categoria") || nomeDoCampo.equals("categorias")) {
                ComboBox<String> comboBoxCategoria = new ComboBox<>();
                comboBoxCategoria.setPromptText("Selecione uma categoria...");
                referenciaComboCategoria = comboBoxCategoria; // Salva a caixa na variável chave!

                comboBoxCategoria.setOnShowing(event -> {
                    comboBoxCategoria.getItems().clear();
                    comboBoxCategoria.getItems().addAll(dados.buscarNomesCategorias());
                });

                campos[i] = comboBoxCategoria;
                painel.add(label, 0, i);
                painel.add(comboBoxCategoria, 1, i);


                // --- LÓGICA DO COMBOBOX DE SUBCATEGORIA - CASCATA ---
            } else if (nomeDoCampo.equals("subcategoria") || nomeDoCampo.equals("subcategorias")) {
                ComboBox<String> comboBoxSubcategoria = new ComboBox<>();
                comboBoxSubcategoria.setPromptText("Selecione uma subcategoria...");

                final ComboBox<String> comboCatParaFiltro = referenciaComboCategoria;

                comboBoxSubcategoria.setOnShowing(event -> {
                    comboBoxSubcategoria.getItems().clear();
                    String catSelecionada = (comboCatParaFiltro != null) ? comboCatParaFiltro.getValue() : null;
                    comboBoxSubcategoria.getItems().addAll(dados.buscarSubcategoriasPorCategoria(catSelecionada));

                    if (comboBoxSubcategoria.getItems().isEmpty() && catSelecionada != null) {
                        comboBoxSubcategoria.setPromptText("Nenhuma subcategoria nesta categoria");
                    } else {
                        comboBoxSubcategoria.setPromptText("Selecione uma subcategoria...");
                    }
                });

                campos[i] = comboBoxSubcategoria;
                painel.add(label, 0, i);
                painel.add(comboBoxSubcategoria, 1, i);


                // --- LÓGICA DO COMBOBOX DE SOLICITAÇÃO ---
            } else if (nomeDoCampo.equals("solicitacao") || nomeDoCampo.equals("solicitação")) {
                ComboBox<String> comboBoxSolicitacao = new ComboBox<>();
                comboBoxSolicitacao.setPromptText("Selecione a solicitação...");

                comboBoxSolicitacao.setOnShowing(event -> {
                    comboBoxSolicitacao.getItems().clear();
                    comboBoxSolicitacao.getItems().addAll(dados.buscarIdentificadoresSolicitacoes());
                });

                campos[i] = comboBoxSolicitacao;
                painel.add(label, 0, i);
                painel.add(comboBoxSolicitacao, 1, i);


                // --- LÓGICA DO COMBOBOX DE STATUS FIXO ---
            } else if (nomeDoCampo.equals("status") && tipo.equals("JustificativaAceite")) {
                ComboBox<String> comboBoxStatus = new ComboBox<>();
                comboBoxStatus.getItems().addAll("Aceito", "Rejeitado", "Pendente");
                comboBoxStatus.setPromptText("Selecione o veredito...");

                campos[i] = comboBoxStatus;
                painel.add(label, 0, i);
                painel.add(comboBoxStatus, 1, i);


                // --- INSERÇÃO DO DATEPICKER E SPINNER PARA DATA ---
            } else if (nomeDoCampo.equals("data") || nomeDoCampo.contains("data")) {
                DatePicker calendario = new DatePicker();
                calendario.setEditable(false);
                calendario.setPrefWidth(120);

                Spinner<Integer> spinnerHora = new Spinner<>(0, 23, 12);
                spinnerHora.setPrefWidth(60);

                Spinner<Integer> spinnerMinuto = new Spinner<>(0, 59, 0);
                spinnerMinuto.setPrefWidth(60);

                HBox caixaDataHora = new HBox(5, calendario, new Label(" Hora:"), spinnerHora, new Label(":"), spinnerMinuto);
                caixaDataHora.setAlignment(Pos.CENTER_LEFT);

                campos[i] = caixaDataHora;
                painel.add(label, 0, i);
                painel.add(caixaDataHora, 1, i);

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
        if (tipo.equals("Professor Validador")) return new ProfessorValidador();
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
            String[] valoresAnteriores = null;

            if (selecionado == null) {
                item = criarObjeto();
                item.setId(dados.proximoId(lista));
                novoRegistro = true;
            } else {
                item = selecionado;
                valoresAnteriores = item.valoresCampos();
            }

            for (int i = 0; i < campos.length; i++) {
                if (campos[i] instanceof TextField) {
                    valores[i] = ((TextField) campos[i]).getText().trim();
                } else if (campos[i] instanceof ComboBox) {
                    Object valorCombo = ((ComboBox<?>) campos[i]).getValue();
                    valores[i] = valorCombo != null ? valorCombo.toString() : "";

                    // --- LEITURA DO SPINNER/DATEPICKER PARA SALVAR ---
                } else if (campos[i] instanceof HBox) {
                    HBox caixa = (HBox) campos[i];
                    DatePicker dp = (DatePicker) caixa.getChildren().get(0);
                    @SuppressWarnings("unchecked") Spinner<Integer> sh = (Spinner<Integer>) caixa.getChildren().get(2);
                    @SuppressWarnings("unchecked") Spinner<Integer> sm = (Spinner<Integer>) caixa.getChildren().get(4);

                    if (dp.getValue() != null) {
                        LocalDateTime dataEHora = LocalDateTime.of(dp.getValue(), LocalTime.of(sh.getValue(), sm.getValue()));
                        valores[i] = dataEHora.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
                    } else {
                        valores[i] = "";
                    }
                }

                if (valores[i].isEmpty()) {
                    throw new Exception("Preencha todos os campos.");
                }
                validarCampo(item.nomeCampos()[i], valores[i]);
            }

            item.preencherCampos(valores);
            if ("Curso".equals(tipo) && valoresAnteriores != null
                    && !Objects.equals(valoresAnteriores[0], valores[0])) {
                dados.atualizarReferenciasCurso(valoresAnteriores[0], valores[0]);
            }
            if (novoRegistro) {
                lista.add(item);
            }
            dados.salvar();
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
            dados.salvar();
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

                // --- PREENCHIMENTO DO SPINNER/DATEPICKER AO CLICAR NA TABELA ---
            } else if (campos[i] instanceof HBox) {
                HBox caixa = (HBox) campos[i];
                DatePicker dp = (DatePicker) caixa.getChildren().get(0);
                @SuppressWarnings("unchecked") Spinner<Integer> sh = (Spinner<Integer>) caixa.getChildren().get(2);
                @SuppressWarnings("unchecked") Spinner<Integer> sm = (Spinner<Integer>) caixa.getChildren().get(4);

                if (valores[i] != null && !valores[i].trim().isEmpty() && !valores[i].equals("Sem data")) {
                    try {
                        LocalDateTime dataEHora = LocalDateTime.parse(valores[i], DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
                        dp.setValue(dataEHora.toLocalDate());
                        sh.getValueFactory().setValue(dataEHora.getHour());
                        sm.getValueFactory().setValue(dataEHora.getMinute());
                    } catch (Exception e) {
                        dp.setValue(null);
                    }
                } else {
                    dp.setValue(null);
                    sh.getValueFactory().setValue(12);
                    sm.getValueFactory().setValue(0);
                }
            }
        }
    }

    private void limparTela() {
        tabela.getSelectionModel().clearSelection();
        for (Node campo : campos) {
            if (campo instanceof TextField) {
                ((TextField) campo).clear();
            } else if (campo instanceof ComboBox) {
                ((ComboBox<?>) campo).getSelectionModel().clearSelection();

                // --- LIMPEZA DO SPINNER/DATEPICKER AO CLICAR EM NOVO ---
            } else if (campo instanceof HBox) {
                HBox caixa = (HBox) campo;
                ((DatePicker) caixa.getChildren().get(0)).setValue(null);
                @SuppressWarnings("unchecked") Spinner<Integer> sh = (Spinner<Integer>) caixa.getChildren().get(2);
                @SuppressWarnings("unchecked") Spinner<Integer> sm = (Spinner<Integer>) caixa.getChildren().get(4);
                sh.getValueFactory().setValue(12);
                sm.getValueFactory().setValue(0);
            }
        }
    }

    @Override
    public void atualizarLista() {
        if (!Platform.isFxApplicationThread()) {
            Platform.runLater(this::atualizarListaNaTela);
            return;
        }
        atualizarListaNaTela();
    }

    private void atualizarListaNaTela() {
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