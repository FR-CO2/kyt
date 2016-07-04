/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.histo;

import org.co2.kanban.repository.taskhisto.TaskHisto;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class TaskHistoResource extends IdentifiableResourceSupport<TaskHisto> {

    public TaskHistoResource(TaskHisto task) {
        super(task);
    }
}
