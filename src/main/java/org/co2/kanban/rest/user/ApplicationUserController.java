/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user;

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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
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
@RequestMapping(value = "/api/user")
public class ApplicationUserController {

    @Autowired
    private ApplicationUserRepository repository;

    @Autowired
    private MemberAssembler memberAssembler;

    @Autowired
    private TaskRepository taskRepositoy;

    @Autowired
    private UserAssembler userAssembler;

    @Autowired
    private PagedResourcesAssembler<ApplicationUser> pagedAssembler;

    @Autowired
    private TaskAssembler taskAssembler;

    @Autowired
    private PagedResourcesAssembler<Task> pagedTaskAssembler;

    @RequestMapping(params = {"page", "size"}, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<UserResource> page(
            @RequestParam(name = "page") Integer page,
            @RequestParam(name = "size", required = false) Integer size) {
        Pageable pageable = new PageRequest(page, size);
        return pagedAssembler.toResource(repository.findAll(pageable), userAssembler);
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<UserResource> list() {
        return userAssembler.toResources(repository.findAll());
    }

    @RequestMapping(value = "/find/{username}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<UserResource> findByUsername(@PathVariable("username") String username) {
        return userAssembler.toResources(repository.findByUsernameContaining(username));
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResource> create(@RequestBody ApplicationUser newUser) {
        ApplicationUser user = repository.save(newUser);
        MultiValueMap<String, String> headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, linkTo(methodOn(ApplicationUserController.class).get(user.getId())).toString());
        ResponseEntity resp = new ResponseEntity(headers, HttpStatus.CREATED);
        return resp;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResource> get(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(userAssembler.toResource(repository.findOne(userId)), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("id") Long userId) {
        repository.delete(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/{id}/member", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MemberResource>> memberOf(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(memberAssembler.toResources(repository.findOne(userId).getMembers()), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/task", params={"page", "size"}, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<TaskResource> pageTask(@PathVariable("id") Long userId,
                                                @RequestParam("page") Integer page,
                                                @RequestParam("size") Integer size) {
        ApplicationUser appUser = repository.findOne(userId);
        Pageable pageable = new PageRequest(page, size);
        Page<Task> tasks = taskRepositoy.findByAssigneeUser(appUser, pageable);
        return pagedTaskAssembler.toResource(tasks, taskAssembler);
    }
    
    @RequestMapping(value = "/{id}/task", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskResource> tasks(@PathVariable("id") Long userId) {
        ApplicationUser appUser = repository.findOne(userId);
        Iterable<Task> tasks = taskRepositoy.findByAssigneeUser(appUser);
        return taskAssembler.toResources(tasks);
    }

}
