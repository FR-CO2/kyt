/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.comment;

import org.co2.kanban.repository.task.Task;
import org.springframework.data.repository.CrudRepository;

/**
 *
 * @author ben
 */
public interface CommentRepository extends CrudRepository<Comment, Long> {
    
    Iterable<Comment> findByTask(Task task);
}
