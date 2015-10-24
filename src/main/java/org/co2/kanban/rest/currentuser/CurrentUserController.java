/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.currentuser;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.co2.kanban.repository.user.ApplicationUserRole;
import java.security.Principal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.member.MemberRepository;
import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.repository.allocation.AllocationRepository;
import org.co2.kanban.rest.project.ProjectAssembler;
import org.co2.kanban.rest.project.ProjectResource;
import org.co2.kanban.rest.project.task.TaskAssembler;
import org.co2.kanban.rest.project.task.TaskResource;
import org.co2.kanban.rest.user.UserAssembler;
import org.co2.kanban.rest.user.UserResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
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
    private ApplicationUserRepository userRepository;

    @Autowired
    private UserAssembler userAssembler;


    @RequestMapping(value = "userProfile", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public UserResource getCurrentUser(@AuthenticationPrincipal Principal user) {
        return userAssembler.toResource(userRepository.findByUsername(user.getName()));
    }

}
