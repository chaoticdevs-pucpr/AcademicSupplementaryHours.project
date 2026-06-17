package ash;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;

public class ArquivoDados {
    private static final String PASTA = "data";

    public static DadosSistema carregar() {
        DadosSistema dados = new DadosSistema(); // Já cria embutindo o admin padrão

        File pasta = new File(PASTA);
        if (!pasta.exists()) {
            pasta.mkdir(); // Se a pasta toda sumir, recria ela.
        }

        dados.setCoordenadores(carregarLista("coordenadores.dat", dados.getCoordenadores()));
        dados.setEstudantes(carregarLista("estudantes.dat", dados.getEstudantes()));
        dados.setAdministradores(carregarLista("administradores.dat", dados.getAdministradores()));
        dados.setSolicitacao(carregarLista("solicitacoes.dat", dados.getSolicitacao()));
        dados.setSugestao(carregarLista("sugestoes.dat", dados.getSugestao()));
        dados.setProfessorValidador(carregarLista("professores.dat", dados.getProfessorValidador()));
        dados.setEvento(carregarLista("eventos.dat", dados.getEvento()));
        dados.setCursos(carregarLista("cursos.dat", dados.getCursos()));
        dados.setTurmas(carregarLista("turmas.dat", dados.getTurmas()));
        dados.setManual(carregarLista("manuais.dat", dados.getManual()));
        dados.setCategorias(carregarLista("categorias.dat", dados.getCategorias()));

        return dados;
    }

    public static void salvar(DadosSistema dados) {
        File pasta = new File(PASTA);
        if (!pasta.exists()) {
            pasta.mkdir();
        }

        salvarLista("coordenadores.dat", dados.getCoordenadores());
        salvarLista("estudantes.dat", dados.getEstudantes());
        salvarLista("administradores.dat", dados.getAdministradores());
        salvarLista("solicitacoes.dat", dados.getSolicitacao());
        salvarLista("sugestoes.dat", dados.getSugestao());
        salvarLista("professores.dat", dados.getProfessorValidador());
        salvarLista("eventos.dat", dados.getEvento());
        salvarLista("cursos.dat", dados.getCursos());
        salvarLista("turmas.dat", dados.getTurmas());
        salvarLista("manuais.dat", dados.getManual());
        salvarLista("categorias.dat", dados.getCategorias());
    }

    // --- MÉTODOS AUXILIARES ---

    private static void salvarLista(String nomeArquivo, ArrayList<?> lista) {
        try {
            File arquivo = new File(PASTA + "/" + nomeArquivo);
            ObjectOutputStream saida = new ObjectOutputStream(new FileOutputStream(arquivo));
            saida.writeObject(lista);
            saida.close();
        } catch (Exception erro) {
            System.out.println("Erro ao salvar " + nomeArquivo + ": " + erro.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private static <T> ArrayList<T> carregarLista(String nomeArquivo, ArrayList<T> listaPadrao) {
        try {
            File arquivo = new File(PASTA + "/" + nomeArquivo);
            if (!arquivo.exists()) {
                return listaPadrao;
            }
            ObjectInputStream entrada = new ObjectInputStream(new FileInputStream(arquivo));
            ArrayList<T> listaCarregada = (ArrayList<T>) entrada.readObject();
            entrada.close();
            return listaCarregada;
        } catch (Exception erro) {
            System.out.println("Aviso: Falha ao ler " + nomeArquivo + ". Criando um novo. Erro: " + erro.getMessage());
            return listaPadrao;
        }
    }
}