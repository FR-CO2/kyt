/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import org.co2.kanban.repository.task.Task;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author courtib
 */
public class TaskLinkResource extends IdentifiableResourceSupport<Task> {

    public TaskLinkResource(Task task) {
        super(task);
    }

    public String getName() {
        return getBean().getName();
    }

}
