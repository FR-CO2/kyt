/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.task;

import java.util.ArrayList;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.rest.project.task.TaskListFilter;
import org.springframework.data.jpa.domain.Specification;

/**
 *
 * @author granels
 */
public class ProjectTaskFilterSpecification implements Specification<Task> {

    private final TaskListFilter taskListFilter;
    private final Project project;

    public ProjectTaskFilterSpecification(Project project, TaskListFilter taskListFilter) {
        this.project = project;
        this.taskListFilter = taskListFilter;
    }

    @Override
    public Predicate toPredicate(Root<Task> root, CriteriaQuery<?> cq, CriteriaBuilder cb) {

        ArrayList<Predicate> predicats = new ArrayList<>();

        Predicate predProject = cb.equal(root.get("project").as(Project.class), project);
        predicats.add(predProject);
        if (this.taskListFilter.getIdState() != null) {
            predicats.add(cb.equal(root.get("state").get("id").as(Long.class), taskListFilter.getIdState()));
        }

        if (this.taskListFilter.getIdSwimlane() != null) {
            predicats.add(cb.equal(root.get("swimlane").get("id").as(Long.class), taskListFilter.getIdSwimlane()));
        }

        if (this.taskListFilter.getIdCategory() != null) {
            predicats.add(cb.equal(root.get("category").get("id").as(Long.class), taskListFilter.getIdCategory()));
        }
        
        if(this.taskListFilter.getIdAssignee() != null){
            predicats.add(cb.equal(root.join("assignees").get("id").as(Long.class), this.taskListFilter.getIdAssignee()));
        }
        
        if(this.taskListFilter.isDeleted() == null || !this.taskListFilter.isDeleted()){
            predicats.add(cb.equal(root.get("deleted").as(Boolean.class), Boolean.FALSE));
        }
        Predicate searchPredicate = cb.and(predicats.toArray(new Predicate[predicats.size()]));
        return searchPredicate;
    }

}
