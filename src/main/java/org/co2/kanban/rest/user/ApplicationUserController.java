/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user;

import java.security.Principal;
import java.util.List;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.co2.kanban.repository.user.ApplicationUserRole;
import org.co2.kanban.rest.project.ProjectAssembler;
import org.co2.kanban.rest.project.ProjectResource;
import org.co2.kanban.rest.project.member.MemberAssembler;
import org.co2.kanban.rest.project.member.MemberResource;
import org.co2.kanban.rest.project.task.TaskAssembler;
import org.co2.kanban.rest.project.task.TaskResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
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
@RequestMapping(value = "/api/user")
public class ApplicationUserController {

    @Autowired
    private ApplicationUserRepository repository;

    @Autowired
    private MemberAssembler memberAssembler;
    
    @Autowired
    private TaskRepository taskRepositoy;

    @Autowired
    private ProjectRepository projectRepositoy;


    @Autowired
    private UserAssembler userAssembler;

    @Autowired
    private PagedResourcesAssembler<ApplicationUser> pagedAssembler;

    @Autowired
    private ProjectAssembler projectAssembler;

    @Autowired
    private TaskAssembler taskAssembler;

    @Autowired
    private PagedResourcesAssembler<Project> pagedProjectAssembler;

    @Autowired
    private PagedResourcesAssembler<Task> pagedTaskAssembler;

    @RequestMapping(value = "page", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<UserResource> page(Pageable p) {
        return pagedAssembler.toResource(repository.findAll(p), userAssembler);
    }

    @RequestMapping(value = "find/{username}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public List<UserResource> findByUsername(@PathVariable("username") String username) {
        return userAssembler.toResources(repository.findByUsernameContaining(username));
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResource> create(@RequestBody ApplicationUser newUser) {
        return new ResponseEntity<>(userAssembler.toResource(repository.save(newUser)), HttpStatus.CREATED);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResource> get(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(userAssembler.toResource(repository.findOne(userId)), HttpStatus.OK);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("id") Long userId) {
        repository.delete(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "{id}/member", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MemberResource>> memberOf(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(memberAssembler.toResources(repository.findOne(userId).getMembers()), HttpStatus.OK);
    }

    @RequestMapping(value = "{id}/task", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<TaskResource> listTask(@PathVariable("id") Long userId, Pageable page) {
        ApplicationUser appUser = repository.findOne(userId);
        Page<Task> tasks = taskRepositoy.findByStateCloseStateFalseAndAssigneeUserOrBackupUser(appUser, appUser, page);
        return pagedTaskAssembler.toResource(tasks, taskAssembler);
    }

    @RequestMapping(value = "{id}/project", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<ProjectResource> listProject(@PathVariable("id") Long userId, Pageable page) {
        ApplicationUser appUser = repository.findOne(userId);
        Page<Project> projects;
        if (appUser.getApplicationRole().equals(ApplicationUserRole.ADMIN)) {
            projects = projectRepositoy.findAll(page);
        } else {
            projects = projectRepositoy.findByMembersUser(appUser, page);
        }
        return pagedProjectAssembler.toResource(projects, projectAssembler);
    }

}
