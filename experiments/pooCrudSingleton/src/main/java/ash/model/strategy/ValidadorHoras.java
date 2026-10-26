package ash.strategy;

public class ValidadorHoras implements ValidadorCampoStrategy {
    @Override
    public void validar(String nomeCampo, String valor) throws Exception {
        try {
            Double.parseDouble(valor);
        } catch (NumberFormatException erro) {
            throw new Exception("O campo " + nomeCampo + " deve ser um número.");
        }
    }
}
