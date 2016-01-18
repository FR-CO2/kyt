/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.taskfield;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.taskfield.TaskFieldDefinition;
import org.co2.kanban.repository.taskfield.TaskFieldDefinitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project/{projectId}/taskfield")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class TaskFieldDefController {

    @Autowired
    private TaskFieldDefinitionRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskFieldDefAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskFieldDefResource> projectList(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return assembler.toResources(repository.findByProject(project));
    }

    @RequestMapping(value = "/{defId}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public TaskFieldDefResource get(@PathVariable("projectId") Long projectId, @PathVariable("defId") Long defId) {
        return assembler.toResource(repository.findOne(defId));
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public HttpEntity create(@PathVariable("projectId") Long projectId, @RequestBody TaskFieldDefinition definition) {
        Project project = projectRepository.findOne(projectId);
        definition.setProject(project);
        TaskFieldDefinition result = repository.save(definition);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(linkTo(methodOn(this.getClass()).get(result.getProject().getId(), result.getId())).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }
}
