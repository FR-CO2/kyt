/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.histo;

import nl.renarj.jasdb.core.exceptions.JasDBStorageException;
import org.co2.kanban.business.project.task.history.TaskHistoRest;
import org.co2.kanban.repository.taskhisto.TaskHisto;
import org.co2.kanban.repository.taskhisto.TaskHistoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project/{projectId}/task/{taskId}/histo")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class TaskHistoController {

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskHistoController.class);
    @Autowired
    private TaskHistoRepository repository;

    @Autowired
    private TaskHistoAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskHistoResource> list(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId,
        @RequestParam(name = "page") Integer page,
        @RequestParam(name = "size", required = false) Integer size) {

        List<TaskHistoRest> tasksHistoRest = new ArrayList<>();
        try {
            List<TaskHisto> tasksHisto = repository.findTop1ByTaskId(taskId, page, size);

            for(TaskHisto taskHisto : tasksHisto) {
                TaskHistoRest taskHistoRest = new TaskHistoRest();
                taskHistoRest.convertTaskHistoRest(taskHistoRest, taskHisto);
                tasksHistoRest.add(taskHistoRest);
            }
        } catch (JasDBStorageException ex){
            LOGGER.error(ex.getMessage());
        }
        return assembler.toResources(tasksHistoRest);
    }

}
