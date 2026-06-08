package ash;

import ash.model.Administrador;
import ash.model.CadastroItem;
import ash.model.Solicitacao;
import ash.model.Sugestao;

import java.io.Serializable;
import java.util.ArrayList;

public class DadosSistema implements Serializable {

    private ArrayList<CadastroItem> coordenadores = new ArrayList<>();
    private ArrayList<CadastroItem> estudantes = new ArrayList<>();
    private ArrayList<Administrador> administradores = new ArrayList<>();
    private ArrayList<CadastroItem> solicitacao = new ArrayList<>();
    private ArrayList<CadastroItem> sugestao = new ArrayList<>();

    public DadosSistema() {

        Administrador adminPadrao = new Administrador();
        adminPadrao.setId(1);
        adminPadrao.setNome("Administrador");
        adminPadrao.setEmail("admin@ash.com");
        adminPadrao.setSenha("1234");
        adminPadrao.setStatus("Ativo");

        this.administradores.add(adminPadrao);
    }

    public ArrayList<CadastroItem> getCoordenadores() {
        return coordenadores;
    }

    public ArrayList<CadastroItem> getEstudantes() {
        return estudantes;
    }

    public ArrayList<Administrador> getAdministradores() {
        return administradores;
    }

    public ArrayList<CadastroItem> getSolicitacao() {
        return solicitacao;
    }

    public ArrayList<CadastroItem> getSugestao() {
        return sugestao;
    }

    public int proximoId(ArrayList<CadastroItem> lista) {
        int maior = 0;
        for (CadastroItem item : lista) {
            if (item.getId() > maior) {
                maior = item.getId();
            }
        }
        return maior + 1;
    }
}