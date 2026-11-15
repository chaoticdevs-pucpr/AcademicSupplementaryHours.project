package test;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.Query;
import model.Administrador;
import model.Curso;
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

        // UPDATE
        Administrador adminProcurado = buscarPorCpf("22222222222", em);
        adminProcurado.setStatus("INATIVO");
        System.out.println("CPF atualizado: " + adminProcurado.getCpf());
        System.out.println("Novo status: " + adminProcurado.getStatus());

        adminProcurado.alterarTurma(em, "Turma A - Atualizada", curso2);
        System.out.println("Turma atualizada: " + turmaCriada.getNome());

        // DELETE
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

}
