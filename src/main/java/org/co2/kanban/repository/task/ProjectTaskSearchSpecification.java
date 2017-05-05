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
import org.co2.kanban.repository.project.Project;
import org.springframework.data.jpa.domain.Specification;

/**
 *
 * @author courtib
 */
public class ProjectTaskSearchSpecification implements Specification<Task> {

    private final Project project;

    private final String searchTerm;
    private final Long idTask;

    public ProjectTaskSearchSpecification(Project project, Long idTask, String searchTerm) {
        this.project = project;
        this.searchTerm = searchTerm;
        this.idTask = idTask;
    }

    @Override
    public Predicate toPredicate(Root<Task> root, CriteriaQuery<?> cq, CriteriaBuilder cb) {

        Predicate id = cb.equal(cb.toString(root.get("id").as(Character.class)), searchTerm);
        String likeSearchTerm = "%".concat(searchTerm.toUpperCase()).concat("%");
        Predicate name = cb.like(cb.upper(root.get("name").as(String.class)), likeSearchTerm);
        Predicate projectPredicate = cb.equal(root.join("project"), project);
        Predicate task = cb.notEqual(root.get("id").as(Long.class), this.idTask);
        return cb.and(projectPredicate, task, cb.or(id,name));
    }

}