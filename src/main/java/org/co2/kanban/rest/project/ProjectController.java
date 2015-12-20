/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.state.State;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.co2.kanban.repository.user.ApplicationUserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
    private ApplicationUserRepository userRespository;

    @Autowired
    private PagedResourcesAssembler<Project> pagedAssembler;

    @Autowired
    private ProjectAssembler assembler;

    @RequestMapping(params = {"page", "size"}, method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<ProjectResource> page(
            @AuthenticationPrincipal Principal user,
            @RequestParam(name = "page") Integer page,
            @RequestParam(name = "size", required = false) Integer size) {
        Pageable pageable = new PageRequest(page, size);
        ApplicationUser appuser = userRespository.findByUsername(user.getName());
        Page<Project> projects;
        if (appuser.hasRole(ApplicationUserRole.ADMIN)) {
            projects = repository.findAll(pageable);
        } else {
            projects = repository.findByMembersUser(appuser, pageable);
        }
        return pagedAssembler.toResource(projects, assembler);
    }

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<ProjectResource> list(@AuthenticationPrincipal Principal user) {
        ApplicationUser appuser = userRespository.findByUsername(user.getName());
        Iterable<Project> projects;
        if (appuser.hasRole(ApplicationUserRole.ADMIN)) {
            projects = repository.findAll();
        } else {
            projects = repository.findByMembersUser(appuser);
        }
        return assembler.toResources(projects);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectResource> create(@RequestBody Project newProject) {
        newProject.setStates(getDefaults(newProject));
        Project result = repository.save(newProject);
        return new ResponseEntity<>(assembler.toResource(result), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{projectId}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectResource> get(@PathVariable("projectId") Long projectId) {
        return new ResponseEntity<>(assembler.toResource(repository.findOne(projectId)), HttpStatus.OK);
    }

    @RequestMapping(value = "/{projectId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("projectId") Long projectId) {
        repository.delete(projectId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private List<State> getDefaults(Project project) {
        State backlog = new State();
        backlog.setName("Backlog");
        backlog.setPosition(0L);
        backlog.setProject(project);
        State ready = new State();
        ready.setName("Prêt");
        ready.setPosition(1L);
        ready.setProject(project);
        State inProgress = new State();
        inProgress.setName("En cours");
        inProgress.setPosition(2L);
        inProgress.setProject(project);
        State done = new State();
        done.setName("Terminé");
        done.setPosition(3L);
        done.setProject(project);
        done.setCloseState(Boolean.TRUE);
        List<State> defaults = new ArrayList<>();
        defaults.add(backlog);
        defaults.add(ready);
        defaults.add(inProgress);
        defaults.add(done);
        return defaults;
    }
}
