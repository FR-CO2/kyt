/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.timesheet;

import org.co2.kanban.project.task.Task;
import org.co2.kanban.project.task.TaskRepository;
import org.co2.kanban.user.ApplicationUser;
import org.co2.kanban.user.ApplicationUserRepository;
import java.security.Principal;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
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
@RequestMapping(value = "/api/timesheet")
public class TimesheetController {

    @Autowired
    private ApplicationUserRepository userRepositoy;

    @Autowired
    private TaskRepository taskRepository;

    @RequestMapping(value = "/api/timesheet/tasks/{day}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Task> taskList(@AuthenticationPrincipal Principal user, @PathVariable("day") Long day) {
        ApplicationUser appUser = getCurrentUser(user);
        Date taskAvailableDate = new Date(day);
        return taskRepository.findByAssigneeUserAndPlannedEndingAfterAndPlannedStartBefore(appUser, taskAvailableDate, taskAvailableDate);
    }

    private ApplicationUser getCurrentUser(Principal user) {
        return userRepositoy.findByUsername(user.getName());
    }

}
