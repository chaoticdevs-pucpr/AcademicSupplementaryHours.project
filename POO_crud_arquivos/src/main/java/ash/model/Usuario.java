package ash.model;

import java.io.Serializable;

public class Usuario implements CadastroItem, Serializable {
    private int id;
    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private String celular;
    private String telefone;
    private String status;

    public Usuario() {
    }

// getters e setters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }
    public String getCelular() {
        return celular;
    }
    public void setCelular(String celular) {
        this.celular = celular;
    }
    public String getTelefone() {
        return telefone;
    }
    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

// metodos da interface

    //vai ser usado na tela para puxar os nomes do campos e exibir eles
    public String[] nomeCampos(){
        return new String[]{"Nome", "Cpf", "Email", "Senha", "Celular", "Telefone", "Status"};
    }

    // vai devolver os atributos como vetor, vai ficar mais facil de fazer para editar depois
    public String[] valoresCampos(){
        return new String[]{nome,cpf,email,senha,celular,telefone,status};
    }

    // vai preencher os campos de acordo com oq for colocado no vetor
    public void preencherCampos(String[]valores){
        nome = valores[0];
        cpf = valores[1];
        email = valores[2];
        senha = valores[3];
        celular = valores[4];
        telefone = valores[5];
        status = valores[6];
    }

    // colocar todos os atributos em um texto bonitinho
    public String textoLista(){
        return getNome() + " - " + getCpf() + " - " + getEmail() + " - " + getSenha() + " - " + getCelular() + " - " + getTelefone() + " - " + getStatus() + " - ";
    }
}
