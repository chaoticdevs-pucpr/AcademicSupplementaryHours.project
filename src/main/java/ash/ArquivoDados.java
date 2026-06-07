package ash;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

public class ArquivoDados {
    private static final String PASTA = "data";
    private static final String ARQUIVO = "data/ash-dados.dat";

    public static DadosSistema carregar() {
        try {
            File arquivo = new File(ARQUIVO);
            if (!arquivo.exists()) {
                return new DadosSistema();
            }

            ObjectInputStream entrada = new ObjectInputStream(new FileInputStream(arquivo));
            DadosSistema dados = (DadosSistema) entrada.readObject();
            entrada.close();
            return dados;
        } catch (Exception erro) {
            System.out.println("Erro ao carregar dados: " + erro.getMessage());
            return new DadosSistema();
        }
    }

    public static void salvar(DadosSistema dados) {
        try {
            File pasta = new File(PASTA);
            if (!pasta.exists()) {
                pasta.mkdir();
            }

            ObjectOutputStream saida = new ObjectOutputStream(new FileOutputStream(ARQUIVO));
            saida.writeObject(dados);
            saida.close();
        } catch (Exception erro) {
            throw new RuntimeException("Erro ao salvar arquivo: " + erro.getMessage());
        }
    }
}

