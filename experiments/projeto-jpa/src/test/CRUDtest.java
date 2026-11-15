package test;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.Query;
import model.Administrador;
import model.Atividade;
import model.Curso;
import model.ProfessorValidador;
import model.Turma;

public class CRUDtest {

    public static void main(String[] args) {

        EntityManagerFactory emf = Persistence.createEntityManagerFactory("ashPU");
        EntityManager em = emf.createEntityManager();

        em.getTransaction().begin();

        // CREATE
        Curso curso1 = new Curso("Engenharia de Software");
        Curso curso2 = new Curso("Ciência da Computação");
        em.persist(curso1);
        em.persist(curso2);

        Administrador admin1 = new Administrador("Daniel Felix", "11111111111", "admin@ash.com", "1234", "ATIVO");
        Administrador admin2 = new Administrador("Random Kid", "22222222222", "random@ash.com", "1234", "ATIVO");
        admin1.setCurso(curso1);
        admin2.setCurso(curso2);
        em.persist(admin1);
        em.persist(admin2);

        Turma turmaCriada = admin2.cadastrarTurma(em, "Turma A", curso2);

        ProfessorValidador prof1 = new ProfessorValidador("Rodrigo Josué", "33333333333", "prof1@ash.com", "1234", "ATIVO", "MAT-001", "CNDB-001");
        ProfessorValidador prof2 = new ProfessorValidador("Roberto Josué", "44444444444", "prof2@ash.com", "1234", "ATIVO", "MAT-002", "CNDB-002");
        em.persist(prof1);
        em.persist(prof2);

        Atividade atividade1 = new Atividade(LocalDateTime.now(), 20.0, 0.0, "PENDENTE", null, "Atividades Acadêmicas", "certificado.pdf");
        atividade1.setProfessorValidador(prof1);
        atividade1.setTurma(turmaCriada);
        em.persist(atividade1);

        // READ
        Query query = em.createQuery("select a from Administrador a");
        List<Administrador> administradores = query.getResultList();
        for (Administrador a : administradores) {
            System.out.println("Nome: " + a.getNome() + " / CPF: " + a.getCpf() + " / Status: " + a.getStatus());
        }

        Query turmasQuery = em.createQuery("select t from Turma t");
        List<Turma> turmas = turmasQuery.getResultList();
        for (Turma t : turmas) {
            System.out.println("Turma: " + t.getNome() + " / Curso: " + t.getCurso().getNome());
        }

        Query professoresQuery = em.createQuery("select p from ProfessorValidador p");
        List<ProfessorValidador> professores = professoresQuery.getResultList();
        for (ProfessorValidador p : professores) {
            System.out.println("Professor: " + p.getNome() + " / Matrícula: " + p.getMatriculaInstitucional() + " / Status: " + p.getStatus());
        }

        Query atividadesQuery = em.createQuery("select at from Atividade at");
        List<Atividade> atividades = atividadesQuery.getResultList();
        for (Atividade at : atividades) {
            System.out.println("Atividade: " + at.getCategoria() + " / Horas Brutas: " + at.getHorasBrutas() + " / Status: " + at.getStatus());
        }

        // UPDATE
        Administrador adminProcurado = buscarPorCpf("22222222222", em);
        adminProcurado.setStatus("INATIVO");
        System.out.println("CPF atualizado: " + adminProcurado.getCpf());
        System.out.println("Novo status: " + adminProcurado.getStatus());

        adminProcurado.alterarTurma(em, "Turma A - Atualizada", curso2);
        System.out.println("Turma atualizada: " + turmaCriada.getNome());

        ProfessorValidador profProcurado = buscarProfessorPorCpf("44444444444", em);
        profProcurado.setStatus("INATIVO");
        System.out.println("Professor atualizado: " + profProcurado.getNome() + " / Novo status: " + profProcurado.getStatus());

        prof1.aprovarAtividade(atividade1, 15.0);
        System.out.println("Atividade atualizada: " + atividade1.getStatus() + " / Horas Validadas: " + atividade1.getHorasValidadas());

        // DELETE
        atividade1.setProfessorValidador(null);
        atividade1.setTurma(null);
        em.remove(atividade1);

        ProfessorValidador profParaRemover = buscarProfessorPorCpf("44444444444", em);
        em.remove(profParaRemover);

        adminProcurado.excluirTurma(em);

        Administrador adminParaRemover = buscarPorCpf("22222222222", em);
        em.remove(adminParaRemover);

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
