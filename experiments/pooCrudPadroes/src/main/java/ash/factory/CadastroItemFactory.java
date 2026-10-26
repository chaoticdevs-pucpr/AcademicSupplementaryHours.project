package ash.factory;

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

public class CadastroItemFactory {

    // Concentra a criação das instâncias de CadastroItem (Factory)
    public static CadastroItem criar(String tipo) {
        if (tipo == null) return null;

        switch (tipo) {
            case "Curso": return new Curso();
            case "Turma": return new Turma();
            case "Manual": return new Manual();
            case "Categorias": return new Categorias();
            case "Coordenador": return new Coordenador();
            case "Estudante": return new Estudante();
            case "Solicitacao": return new Solicitacao();
            case "Professor Validador": return new ProfessorValidador();
            case "Subcategoria": return new Subcategoria();
            case "JustificativaAceite": return new JustificativaAceite();
            default: return null;
        }
    }
}

