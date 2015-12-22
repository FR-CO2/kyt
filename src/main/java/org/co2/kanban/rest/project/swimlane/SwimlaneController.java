/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.swimlane;

import org.co2.kanban.repository.swimlane.Swimlane;
import org.co2.kanban.repository.swimlane.SwimlaneRepository;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.member.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
@RestController
@RequestMapping(value = "/api/project/{projectId}/swimlane")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class SwimlaneController {

    @Autowired
    private SwimlaneRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SwimlaneAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<SwimlaneResource> projectList(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return assembler.toResources(repository.findByProjectOrderByPositionAsc(project));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity delete(@PathVariable("id") Long id) {
        repository.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Swimlane> get(@PathVariable("id") Long id) {
        Swimlane swimlane = repository.findOne(id);
        return new ResponseEntity(swimlane, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    public ResponseEntity<Swimlane> create(@PathVariable("projectId") Long projectId, @RequestBody Swimlane swimlane) {
        Project project = projectRepository.findOne(projectId);
        swimlane.setProject(project);
        Long maxPosition = repository.getProjectMaxPosition(projectId);
        swimlane.setPosition(maxPosition);
        repository.save(swimlane);
        return new ResponseEntity(HttpStatus.CREATED);
    }

}
