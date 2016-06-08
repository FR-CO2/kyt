/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.taskfield;

import org.co2.kanban.repository.project.Project;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface TaskFieldDefinitionRepository extends PagingAndSortingRepository<TaskFieldDefinition, Long> {
    
    Iterable<TaskFieldDefinition> findByProject(Project project);
    
}
