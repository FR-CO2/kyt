/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.state.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project")
public class ProjectController {

    @Autowired
    private ProjectRepository repository;

    @Autowired
    private PagedResourcesAssembler<Project> pagedAssembler;

    @Autowired
    private ProjectAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<ProjectResource> list(Pageable p) {
        return pagedAssembler.toResource(repository.findAll(p), assembler);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectResource> create(@RequestBody Project newProject) {
        newProject.setStates(State.getDefaults(newProject));
        Project result = repository.save(newProject);
        return new ResponseEntity<>(assembler.toResource(result), HttpStatus.CREATED);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectResource> get(@PathVariable("id") Long projectId) {
        return new ResponseEntity<>(assembler.toResource(repository.findOne(projectId)), HttpStatus.OK);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("id") Long projectId) {
        repository.delete(projectId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
