package ash.strategy;

public class ValidadorNumerico implements ValidadorCampoStrategy {
    @Override
    public void validar(String nomeCampo, String valor) throws Exception {
        if (!valor.matches("\\d+")) {
            throw new Exception("O campo " + nomeCampo + " deve conter apenas números.");
        }
    }
}
