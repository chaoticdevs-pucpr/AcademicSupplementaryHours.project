package ash.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Evento implements CadastroItem, Serializable {

    private static final DateTimeFormatter FORMATADOR = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private int id;
    private String nome;
    private LocalDateTime data;
    private String descricao;
    private String tipo;

    public Evento() {
    }

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public LocalDateTime getData() {
        return data;
    }
    public void setData(LocalDateTime data) {
        this.data = data;
    }
    @Override
    public int getId() {
        return id;
    }
    @Override
    public void setId(int id) {
        this.id = id;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    // --- AQUI COMEÇAM AS CORREÇÕES ---

    @Override
    public String textoLista() {
        // Converte o LocalDateTime para Texto antes de juntar tudo
        String dataFormatada = (data != null) ? data.format(FORMATADOR) : "Sem data";
        return nome + " - " + dataFormatada + " - " + descricao + " - " + tipo;
    }

    @Override
    public void preencherCampos(String[] valores) {
        nome = valores[0];

        // Converte o Texto (valores[1]) para LocalDateTime usando o Formatador
        if (valores[1] != null && !valores[1].trim().isEmpty()) {
            data = LocalDateTime.parse(valores[1], FORMATADOR);
        } else {
            data = null;
        }

        descricao = valores[2];
        tipo = valores[3];
    }

    @Override
    public String[] valoresCampos() {
        // Converte o LocalDateTime para Texto para poder entrar na lista de String[]
        String dataFormatada = (data != null) ? data.format(FORMATADOR) : "";
        return new String[]{nome, dataFormatada, descricao, tipo};
    }

    @Override
    public String[] nomeCampos() {
        return new String[]{"Nome", "Data", "Descrição", "Tipo"};
    }
}