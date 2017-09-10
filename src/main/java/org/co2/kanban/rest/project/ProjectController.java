/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import org.co2.kanban.repository.category.Category;
import org.co2.kanban.repository.member.ProjectRole;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.state.State;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.co2.kanban.repository.user.ApplicationUserRole;
import org.co2.kanban.rest.error.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project")
public class ProjectController {

    private static final String MESSAGE_KEY_NOT_FOUND = "project.error.notfound";

    private static final String MESSAGE_KEY_CONFLICT_NAME = "project.error.conflict.name";

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
    public ResponseEntity create(@RequestBody Project newProject) {
        if (repository.checkExistProject(newProject.getName())) {
            throw new BusinessException(HttpStatus.CONFLICT, MESSAGE_KEY_CONFLICT_NAME);
        }
        newProject.setStates(getDefaultStates(newProject));
        newProject.setCategories(getDefaultCategories(newProject));
        Project result = repository.save(newProject);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(linkTo(methodOn(this.getClass()).get(result.getId())).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{projectId}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectResource> get(@PathVariable("projectId") Long projectId) {
        Project project = repository.findOne(projectId);
        if (project == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        return new ResponseEntity<>(assembler.toResource(project), HttpStatus.OK);
    }

    @RequestMapping(value = "/{projectId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("projectId") Long projectId) {
        repository.delete(projectId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/{projectId}/roles", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectRole[]> roles(@PathVariable("projectId") Long projectId) {
        return new ResponseEntity<>(ProjectRole.values(), HttpStatus.OK);
    }

    private List<State> getDefaultStates(Project project) {
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

    private List<Category> getDefaultCategories(Project project) {
        Category defect = new Category();
        defect.setName("Issue");
        defect.setBgcolor("#FA8258");
        defect.setProject(project);
        Category evolution = new Category();
        evolution.setName("Evolution");
        evolution.setBgcolor("#81DAF5");
        evolution.setProject(project);
        Category assistance = new Category();
        assistance.setName("Assistance");
        assistance.setBgcolor("#D0A9F5");
        assistance.setProject(project);
        List<Category> defaults = new ArrayList<>();
        defaults.add(defect);
        defaults.add(evolution);
        defaults.add(assistance);
        return defaults;
    }
}
