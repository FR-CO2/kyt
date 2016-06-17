/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.search;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.user.ApplicationUser;
import org.springframework.data.jpa.domain.Specification;

/**
 *
 * @author courtib
 */
public class TaskSearch implements Specification<Task>{

    public TaskSearch(ApplicationUser user, String searchTerm) {
        
    }
    
    @Override
    public Predicate toPredicate(Root<Task> root, CriteriaQuery<?> cq, CriteriaBuilder cb) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
}
