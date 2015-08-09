/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.currentuser;

import com.cgi.fgdc.bdx.kanban.ControllerViews;
import com.cgi.fgdc.bdx.kanban.project.Project;
import com.cgi.fgdc.bdx.kanban.project.ProjectRepository;
import com.cgi.fgdc.bdx.kanban.project.task.Task;
import com.cgi.fgdc.bdx.kanban.project.task.TaskRepository;
import com.cgi.fgdc.bdx.kanban.user.ApplicationUser;
import com.cgi.fgdc.bdx.kanban.user.ApplicationUserRepository;
import com.cgi.fgdc.bdx.kanban.user.ApplicationUserRole;
import com.fasterxml.jackson.annotation.JsonView;
import java.security.Principal;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
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
@RequestMapping(value = "/api/")
public class CurrentUserController {

    @Autowired
    private ApplicationUserRepository userRepositoy;

    @Autowired
    private TaskRepository taskRepositoy;

    @Autowired
    private ProjectRepository projectRepositoy;

    @RequestMapping(value = "userProfile", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.User.class)
    public ApplicationUser getCurrentUser(@AuthenticationPrincipal Principal user) {
        return userRepositoy.findByUsername(user.getName());
    }

    @RequestMapping(value = "userTask", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.UserTask.class)
    public Page<Task> listTask(@AuthenticationPrincipal Principal user, Pageable page) {
        ApplicationUser appUser = getCurrentUser(user);
        return taskRepositoy.findByAssigneeUserOrBackupUser(appUser, appUser, page);
    }

    @RequestMapping(value = "userProject", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.ProjectList.class)
    public Page<Project> listProject(@AuthenticationPrincipal Principal user, Pageable page) {
        ApplicationUser appUser = getCurrentUser(user);
        if (appUser.getApplicationRole().equals(ApplicationUserRole.ADMIN)) {
            return projectRepositoy.findAll(page);
        }
        return projectRepositoy.findByMembersUser(getCurrentUser(user), page);
    }

    @RequestMapping(value = "userEvent", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.TaskList.class)
    public Iterable<Task> listTasksEvents(@AuthenticationPrincipal Principal user, @RequestParam Long start, @RequestParam Long end) {
        ApplicationUser appUser = getCurrentUser(user);
        Date startTime = new Date(start * 1000);
        Date endTime = new Date(end * 1000);
        return taskRepositoy.findByAssigneeUserAndPlannedEndingBetweenAndPlannedStartBetween(appUser, startTime, endTime, startTime, endTime);
    }

    @RequestMapping(value = "userTask/day/{day}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.TaskList.class)
    public Iterable<Task> listTaskOfDay(@AuthenticationPrincipal Principal user, @PathVariable("day") Long day) {
        ApplicationUser appUser = getCurrentUser(user);
        Date startTime = new Date(day);
        Date endTime = new Date(day);
        return taskRepositoy.findByAssigneeUserAndPlannedEndingAfterAndPlannedStartBefore(appUser, endTime, startTime);
    }

    @RequestMapping(value = "userTask/search/{day}/{name}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.TaskList.class)
    public Iterable<Task> searchTaskByName(@AuthenticationPrincipal Principal user, @PathVariable("day") Long day,
            @PathVariable("name") String name) {
        ApplicationUser appUser = getCurrentUser(user);
        Date startTime = new Date(day);
        return taskRepositoy.searchByName(name.toUpperCase(), startTime, appUser);
    }
}
