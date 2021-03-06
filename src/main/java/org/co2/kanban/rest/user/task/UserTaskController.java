/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user.task;

import java.sql.Timestamp;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.task.TaskSearchSpecification;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.co2.kanban.rest.project.task.TaskAssembler;
import org.co2.kanban.rest.project.task.TaskResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/user/{userId}/task")
public class UserTaskController {

    @Autowired
    private ApplicationUserRepository repository;

    @Autowired
    private TaskRepository taskRepositoy;

    @Autowired
    private TaskAssembler taskAssembler;

    @Autowired
    private PagedResourcesAssembler<Task> pagedTaskAssembler;

    @RequestMapping(params = {"page", "size"}, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<TaskResource> pageTask(@PathVariable("userId") Long userId,
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size) {
        ApplicationUser appUser = repository.findOne(userId);
        Pageable pageable = new PageRequest(page, size);
        Page<Task> tasks = taskRepositoy.findByAssigneesUserAndStateCloseStateFalse(appUser, pageable);
        return pagedTaskAssembler.toResource(tasks, taskAssembler);
    }

    @RequestMapping(params = {"start", "end"}, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskResource> tasks(@PathVariable("userId") Long userId,
            @RequestParam("start") Long start,
            @RequestParam("end") Long end) {
        ApplicationUser appUser = repository.findOne(userId);
        Timestamp startTime = new Timestamp(start);
        Timestamp endTime = new Timestamp(end);
        Iterable<Task> tasks = taskRepositoy.findByAssigneesUserAndPlannedStartBeforeAndPlannedEndingAfterAndStateCloseStateFalse(appUser, endTime, startTime);
        return taskAssembler.toResources(tasks);
    }

    @RequestMapping(params = {"search"}, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskResource> search(@PathVariable("userId") Long userId,
            @RequestParam("search") String searchTerm) {
        ApplicationUser appUser = repository.findOne(userId);
        TaskSearchSpecification search = new TaskSearchSpecification(appUser, searchTerm);
        Iterable<Task> tasks = taskRepositoy.findAll(search);
        return taskAssembler.toResources(tasks);
    }

}
