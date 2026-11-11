package test;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.Query;
import model.Administrador;

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

        // READ
        Query query = em.createQuery("select a from Administrador a");
        List<Administrador> administradores = query.getResultList();
        for (Administrador a : administradores) {
            System.out.println("Nome: " + a.getNome() + " / CPF: " + a.getCpf() + " / Status: " + a.getStatus());
        }

        // UPDATE
        Administrador adminProcurado = buscarPorCpf("22222222222", em);
        adminProcurado.setStatus("INATIVO");
        System.out.println("CPF atualizado: " + adminProcurado.getCpf());
        System.out.println("Novo status: " + adminProcurado.getStatus());

        // DELETE
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
