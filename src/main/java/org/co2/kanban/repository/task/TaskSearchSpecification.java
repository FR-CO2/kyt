/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.task;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRole;
import org.springframework.data.jpa.domain.Specification;

/**
 *
 * @author courtib
 */
public class TaskSearchSpecification implements Specification<Task> {

    private final ApplicationUser user;

    private final String searchTerm;

    public TaskSearchSpecification(ApplicationUser user, String searchTerm) {
        this.user = user;
        this.searchTerm = searchTerm;
    }

    @Override
    public Predicate toPredicate(Root<Task> root, CriteriaQuery<?> cq, CriteriaBuilder cb) {

        String likeSearchTerm = "%".concat(searchTerm.toUpperCase()).concat("%");
        Predicate id = cb.like(cb.toString(root.get("id").as(Character.class)), likeSearchTerm);
        Predicate name = cb.like(cb.upper(root.get("name").as(String.class)), likeSearchTerm);
        
        Predicate searchPredicate = cb.or(id, name);
        if (!user.hasRole(ApplicationUserRole.ADMIN)) {
             Predicate allowed = cb.equal(root.join("project").join("members").get("user").as(ApplicationUser.class), user);
             searchPredicate = cb.and(allowed, searchPredicate);
        }
        return searchPredicate;        
    }

}
