/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.currentuser;

import org.co2.kanban.ControllerViews;
import org.co2.kanban.project.Project;
import org.co2.kanban.project.ProjectRepository;
import org.co2.kanban.project.task.Task;
import org.co2.kanban.project.task.TaskRepository;
import org.co2.kanban.user.ApplicationUser;
import org.co2.kanban.user.ApplicationUserRepository;
import org.co2.kanban.user.ApplicationUserRole;
import com.fasterxml.jackson.annotation.JsonView;
import java.security.Principal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.co2.kanban.project.security.Member;
import org.co2.kanban.project.security.MemberRepository;
import org.co2.kanban.project.task.allocation.Allocation;
import org.co2.kanban.project.task.allocation.AllocationRepository;
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

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    @RequestMapping(value = "userProfile", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.User.class)
    public ApplicationUser getCurrentUser(@AuthenticationPrincipal Principal user) {
        return userRepositoy.findByUsername(user.getName());
    }

    @RequestMapping(value = "userTask", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.UserTask.class)
    public Page<Task> listTask(@AuthenticationPrincipal Principal user, Pageable page) {
        ApplicationUser appUser = getCurrentUser(user);
        return taskRepositoy.findByStateCloseStateFalseAndAssigneeUserOrBackupUser(appUser, appUser, page);
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

    @RequestMapping(value = "userProjectRole", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.ProjectList.class)
    public List<Member> listProjectRole(@AuthenticationPrincipal Principal user) {
        return getCurrentUser(user).getMembers();
    }

    @RequestMapping(value = "userEvent", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.TaskList.class)
    public Iterable<Task> listTasksEvents(@AuthenticationPrincipal Principal user, @RequestParam Long start, @RequestParam Long end) {
        ApplicationUser appUser = getCurrentUser(user);
        Date startTime = new Date(start * 1000);
        Date endTime = new Date(end * 1000);
        return taskRepositoy.findByAssigneeUserAndStateCloseStateFalseAndPlannedEndingBetweenOrPlannedStartBetween(appUser, startTime, endTime, startTime, endTime);
    }

    @RequestMapping(value = "userTask/day/{day}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.TaskList.class)
    public Iterable<Allocation> listTaskOfDay(@AuthenticationPrincipal Principal user, @PathVariable("day") Long day) {
        ApplicationUser appUser = getCurrentUser(user);
        Date startTime = new Date(day-3600);
        Date endTime = new Date(day+3600);
        List<Allocation> allocations = new ArrayList<>();
        Iterable<Task> tasks = taskRepositoy.findByAssigneeUserAndPlannedEndingAfterAndPlannedStartBefore(appUser, startTime, endTime);
        for (Task task : tasks) {
            Member member = memberRepository.findByProjectIdAndUserUsername(task.getProject().getId(), user.getName());
            Allocation allocation = allocationRepository.findByTaskIdAndAllocationDateAndMember(task.getId(), new Timestamp(day), member);
            if (allocation == null) {
                allocation = new Allocation();
                allocation.setAllocationDate(new Timestamp(day));
                allocation.setTask(task);
                allocation.setMember(member);
            }
            allocations.add(allocation);
        }
        return allocations;
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
