/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.config;

import org.co2.kanban.repository.config.ProjectConfig;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.rest.error.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.co2.kanban.repository.config.ProjectConfigRepository;
import org.co2.kanban.repository.config.ProjectConfigType;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project/{projectId}/config")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class ProjectConfigController {

    
    private static final String MESSAGE_KEY_CONFLICT_NAME = "project.config.error.project.not.found";
    
    @Autowired
    private ProjectConfigRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectConfigAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<ProjectConfigResource> projectList(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        if (project == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_CONFLICT_NAME);
        }
        return assembler.toResources(repository.findByProject(project));
    }
    @RequestMapping(value = "/{category}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<ProjectConfigResource> get(@PathVariable("projectId") Long projectId, @PathVariable("category") ProjectConfigType category) {
        Project project = projectRepository.findOne(projectId);
        if (project == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_CONFLICT_NAME);
        }
        return assembler.toResources(repository.findByProjectAndCategory(project, category));
    }
    
    @RequestMapping(value = "/{category}/{key}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ProjectConfigResource getByName(@PathVariable("projectId") Long projectId, @PathVariable("category") ProjectConfigType category,
            @PathVariable("key") String keyConfig) {
        Project project = projectRepository.findOne(projectId);
        if (project == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_CONFLICT_NAME);
        }
        return assembler.toResource(repository.findByProjectAndCategoryAndKeyConfig(project, category, keyConfig));
    }

    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity update(@PathVariable("projectId") Long projectId, @RequestBody ProjectConfig config) {
        Project project = projectRepository.findOne(projectId);
        if (repository.findByProject(project) == null) {
            throw new BusinessException(HttpStatus.CONFLICT, MESSAGE_KEY_CONFLICT_NAME);
        }
        config.setProject(project);
        ProjectConfig result = repository.save(config);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(linkTo(methodOn(this.getClass()).get(result.getProject().getId(), config.getCategory())).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }
}
