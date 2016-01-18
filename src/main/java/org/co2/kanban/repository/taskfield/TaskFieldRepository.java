/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.taskfield;

import org.co2.kanban.repository.task.Task;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface TaskFieldRepository extends PagingAndSortingRepository<TaskField, TaskField.TaskFieldId> {
    
    TaskField findByDefinitionAndTask(TaskFieldDefinition def, Task task);
    
    Iterable<TaskField> findByTask(Task task);
}
