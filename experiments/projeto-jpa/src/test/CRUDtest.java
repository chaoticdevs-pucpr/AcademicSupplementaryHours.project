package test;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.Query;
import model.Cliente;

public class CRUDtest {

    public static void main(String[] args) {

        EntityManagerFactory emf = Persistence.createEntityManagerFactory("bibliotecaPU");
        EntityManager em = emf.createEntityManager();

        em.getTransaction().begin();

        //CREATE
        Cliente cliente1 = new Cliente("Mauro", "mauro@gmail.com", "1111111", "1111-1111");
        Cliente cliente2 = new Cliente("Pedro", "pedro.com", "22222222", "2222-2222");
        em.persist(cliente1);
        em.persist(cliente2);

        //READ
        Query query = em.createQuery("select c from Cliente c");
        List<Cliente> clientes = query.getResultList();
        for (Cliente c : clientes) {
            System.out.println("Nome: " + c.getNome() + " / CPF: " + c.getCpf());
        }

        //UPDATE
        Cliente clienteProcurado = buscarPorCpf("22222222", em);
        clienteProcurado.setFone("3333-3333");
        System.out.println("cpf:" + clienteProcurado.getCpf());
        System.out.println("fone:" + clienteProcurado.getFone());

        //DELETE
        Cliente cliente = buscarPorCpf("22222222", em);
        em.remove(cliente);

        em.getTransaction().commit();
        em.close();
        emf.close();

    }

    public static Cliente buscarPorCpf(String cpf, EntityManager em) {

        Query query = em.createQuery("select c from Cliente c where c.cpf = :cpf");
        query.setParameter("cpf", cpf);
        List<Cliente> clientes = query.getResultList();

        return (Cliente) query.getSingleResult();

    }

}
