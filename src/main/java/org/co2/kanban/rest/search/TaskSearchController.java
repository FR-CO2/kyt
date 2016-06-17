/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.search;

import java.util.ArrayList;
import java.util.List;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.co2.kanban.rest.project.task.TaskAssembler;
import org.co2.kanban.rest.project.task.TaskResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author stan
 */
@RestController
@RequestMapping(value = "/api/user/{userId}/task/search")
public class TaskSearchController {

    @Autowired
    private ApplicationUserRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepositoy;

    @Autowired
    private TaskAssembler taskAssembler;

    @RequestMapping(params = {"search"}, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<TaskResource> search(@PathVariable("userId") Long userId,
            @RequestParam("search") String searchTerm) {
        ApplicationUser appUser = repository.findOne(userId);
        TaskSearch search = new TaskSearch(appUser, searchTerm);
        Iterable<Task> tasks = taskRepositoy.findAll();
        return taskAssembler.toResources(tasks);
    }
}
