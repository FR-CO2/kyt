/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.search;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;
import org.co2.kanban.repository.member.ProjectMember;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.user.ApplicationUser;
import org.springframework.data.jpa.domain.Specification;

/**
 *
 * @author courtib
 */
public class TaskSearch implements Specification<Task> {

    private final ApplicationUser user;

    private final String searchTerm;

    public TaskSearch(ApplicationUser user, String searchTerm) {
        this.user = user;
        this.searchTerm = searchTerm;
    }

    @Override
    public Predicate toPredicate(Root<Task> root, CriteriaQuery<?> cq, CriteriaBuilder cb) {

        Predicate id = cb.equal(cb.toString(root.get("id").as(Character.class)), searchTerm);
        String likeSearchTerm = "%".concat(searchTerm.toUpperCase()).concat("%");
        Predicate name = cb.like(cb.upper(root.get("name").as(String.class)), likeSearchTerm);

        return cb.or(id, name);
    }

}
