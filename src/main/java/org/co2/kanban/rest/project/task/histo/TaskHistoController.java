/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.histo;

import org.co2.kanban.repository.taskhisto.TaskHistoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project/{projectId}/task/{taskId}/histo")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class TaskHistoController {

    @Autowired
    private TaskHistoRepository repository;


    /*@RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InputStreamResource> list() {
        TaskHisto taskHisto = repository.findById(400L);
        InputStream in = new ByteArrayInputStream(taskHisto.getFile());
        InputStreamResource resource = new InputStreamResource(in);
        return new ResponseEntity<>(resource, HttpStatus.OK);
    }*/

}
