package test;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.Query;
import model.Administrador;
import model.Atividade;
import model.Coordenador;
import model.Curso;
import model.Estudante;
import model.ProfessorValidador;
import model.Turma;

public class CRUDtest {

    public static void main(String[] args) {

        EntityManagerFactory emf = Persistence.createEntityManagerFactory("ashPU");
        EntityManager em = emf.createEntityManager();

        em.getTransaction().begin();

        // CREATE
        Administrador admin1 = new Administrador("Daniel Felix", "11111111111", "admin@ash.com", "1234", "ATIVO");
        Administrador admin2 = new Administrador("Random Kid", "22222222222", "random@ash.com", "1234", "ATIVO");
        em.persist(admin1);
        em.persist(admin2);
        em.flush();

        Curso curso1 = admin1.cadastrarCurso(em, "Engenharia de Software");
        Curso curso2 = admin2.cadastrarCurso(em, "Ciência da Computação");

        Turma turma1 = admin1.cadastrarTurma(em, "Turma A-M", curso1);
        Turma turma2 = admin2.cadastrarTurma(em, "Turma B-N", curso2);

        Coordenador coord1 = new Coordenador("Carlos Silva", "55555555555", "coord1@ash.com", "1234",
                "41999990001", "4133330001", "ATIVO", 1001, curso1);
        Coordenador coord2 = new Coordenador("Marcos Souza", "66666666666", "coord2@ash.com", "1234",
                "41999990002", "4133330002", "ATIVO", 1002, curso2);
        admin1.cadastrarCoordenador(em, coord1);
        admin2.cadastrarCoordenador(em, coord2);

        ProfessorValidador prof1 = new ProfessorValidador("Rodrigo Josué", "33333333333", "prof1@ash.com", "1234",
                "41999990003", "4133330003", "ATIVO", "MAT-001", "CNDB-001");
        ProfessorValidador prof2 = new ProfessorValidador("Roberto Josué", "44444444444", "prof2@ash.com", "1234",
                "41999990004", "4133330004", "ATIVO", "MAT-002", "CNDB-002");
        coord1.cadastrarProfessorValidador(em, prof1);
        coord2.cadastrarProfessorValidador(em, prof2);

        Estudante est1 = new Estudante("Rodrigo José", "77777777777", "estudante1@ash.com", "1234",
                "41999990005", "4133330005", "ATIVO", "2026001");
        Estudante est2 = new Estudante("Ana Paula", "88888888888", "estudante2@ash.com", "1234",
                "41999990006", "4133330006", "ATIVO", "2026002");
        admin1.cadastrarEstudante(em, est1);
        admin2.cadastrarEstudante(em, est2);

        Atividade atividade1 = est1.enviarSolicitacao(em, 20.0, "Atividades Acadêmicas", "certificado1.pdf", turma1);
        Atividade atividade2 = est2.enviarSolicitacao(em, 10.0, "Pesquisa Científica", "certificado2.pdf", turma2);

        // READ
        System.out.println("\n--- LEITURA DE REGISTROS (READ) ---");

        List<Curso> cursos = em.createQuery("select c from Curso c", Curso.class).getResultList();
        for (Curso c : cursos) {
            System.out.println("Curso: " + c.getNome());
        }

        List<Administrador> administradores = em.createQuery("select a from Administrador a", Administrador.class)
                .getResultList();
        for (Administrador a : administradores) {
            System.out.println("Administrador: " + a.getNome() + " / CPF: " + a.getCpf() + " / Status: " + a.getStatus());
        }

        List<Turma> turmas = em.createQuery("select t from Turma t", Turma.class).getResultList();
        for (Turma t : turmas) {
            System.out.println("Turma: " + t.getNome() + " / Curso: " + t.getCurso().getNome());
        }

        List<Coordenador> coordenadores = em.createQuery("select c from Coordenador c", Coordenador.class)
                .getResultList();
        for (Coordenador c : coordenadores) {
            System.out.println("Coordenador: " + c.getNome() + " / CNDB: " + c.getCndb() + " / Curso: "
                    + (c.getCurso() != null ? c.getCurso().getNome() : "-"));
        }

        List<ProfessorValidador> professores = em.createQuery("select p from ProfessorValidador p",
                ProfessorValidador.class).getResultList();
        for (ProfessorValidador p : professores) {
            System.out.println("Professor: " + p.getNome() + " / Matrícula: " + p.getMatriculaInstitucional()
                    + " / Status: " + p.getStatus());
        }

        List<Estudante> estudantes = em.createQuery("select e from Estudante e", Estudante.class).getResultList();
        for (Estudante e : estudantes) {
            System.out.println("Estudante: " + e.getNome() + " / Matrícula: " + e.getMatricula()
                    + " / Status: " + e.getStatus());
        }

        List<Atividade> atividades = em.createQuery("select at from Atividade at", Atividade.class).getResultList();
        for (Atividade at : atividades) {
            System.out.println("Atividade: " + at.getCategoria() + " / Horas Brutas: " + at.getHorasBrutas()
                    + " / Status: " + at.getStatus());
        }

        // UPDATE
        System.out.println("\n--- ATUALIZAÇÃO DE REGISTROS (UPDATE) ---");

        Administrador adminProcurado = buscarPorCpf("22222222222", em);
        adminProcurado.setStatus("INATIVO");
        System.out.println("Administrador atualizado: " + adminProcurado.getNome() + " / Novo status: "
                + adminProcurado.getStatus());

        adminProcurado.alterarCurso(em, "Ciência da Computação - Bacharelado");
        System.out.println("Curso atualizado: " + curso2.getNome());

        adminProcurado.alterarTurma(em, "Turma B-N - Atualizada", curso2);
        System.out.println("Turma atualizada: " + turma2.getNome());

        Coordenador dadosCoordAtualizado = new Coordenador("Marcos Souza Jr", "66666666666", "coord2@ash.com", "1234",
                "41999990002", "4133330002", "INATIVO", 2002, curso2);
        adminProcurado.alterarCoordenador(em, coord2.getId(), dadosCoordAtualizado);
        System.out.println("Coordenador atualizado: " + coord2.getNome() + " / Novo status: " + coord2.getStatus());

        ProfessorValidador profProcurado = buscarProfessorPorCpf("44444444444", em);
        profProcurado.setStatus("INATIVO");
        System.out.println("Professor atualizado: " + profProcurado.getNome() + " / Novo status: "
                + profProcurado.getStatus());

        Estudante dadosEstAtualizado = new Estudante("Ana Paula Oliveira", "88888888888", "estudante2@ash.com", "1234",
                "41999990006", "4133330006", "ATIVO", "2026002-B");
        adminProcurado.alterarEstudante(em, est2.getId(), dadosEstAtualizado);
        System.out.println("Estudante atualizado: " + est2.getNome() + " / Nova matrícula: " + est2.getMatricula());

        prof1.aprovarAtividade(atividade1, 15.0);
        System.out.println("Atividade 1 atualizada: " + atividade1.getStatus() + " / Horas Validadas: "
                + atividade1.getHorasValidadas() + " / Total Horas do Estudante 1: "
                + est1.visualizarHorasComplementares(em));

        // DELETE
        System.out.println("\n--- EXCLUSÃO DE REGISTROS (DELETE) ---");

        atividade2.setProfessorValidador(null);
        atividade2.setTurma(null);
        atividade2.setEstudante(null);
        em.remove(atividade2);
        System.out.println("Atividade 2 removida.");

        adminProcurado.excluirEstudante(em, est2.getId());
        System.out.println("Estudante 2 removido.");

        ProfessorValidador profParaRemover = buscarProfessorPorCpf("44444444444", em);
        profParaRemover.setCoordenador(null);
        em.remove(profParaRemover);
        System.out.println("Professor 2 removido.");

        adminProcurado.excluirCoordenador(em, coord2.getId());
        System.out.println("Coordenador 2 removido.");

        adminProcurado.excluirTurma(em);
        System.out.println("Turma 2 removida.");

        adminProcurado.excluirCurso(em);
        System.out.println("Curso 2 removido.");

        Administrador adminParaRemover = buscarPorCpf("22222222222", em);
        em.remove(adminParaRemover);
        System.out.println("Administrador 2 removido.");

        em.getTransaction().commit();
        em.close();
        emf.close();

    }

    public static Administrador buscarPorCpf(String cpf, EntityManager em) {

        Query query = em.createQuery("select a from Administrador a where a.cpf = :cpf");
        query.setParameter("cpf", cpf);
        List<Administrador> administradores = query.getResultList();

        return administradores.isEmpty() ? null : administradores.get(0);

    }

    public static ProfessorValidador buscarProfessorPorCpf(String cpf, EntityManager em) {

        Query query = em.createQuery("select p from ProfessorValidador p where p.cpf = :cpf");
        query.setParameter("cpf", cpf);
        List<ProfessorValidador> professores = query.getResultList();

        return professores.isEmpty() ? null : professores.get(0);

    }

}
