/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user.consommation;

import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.repository.allocation.AllocationRepository;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.member.MemberRepository;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/user/{userId}/consommation")
public class UserConsommationController {

    
    @Autowired
    private ApplicationUserRepository repository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TaskRepository taskRepositoy;
    
    @Autowired
    private AllocationRepository allocationRepository;
    
    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity consommation(@PathVariable("userId") Long userId, Iterable<Allocation> allocations) {
        ApplicationUser appUser = repository.findOne(userId);
        for (Allocation allocation : allocations) {
            Task task = taskRepositoy.findOne(allocation.getTask().getId());
            Project project = task.getProject();
            Member member = memberRepository.findByProjectAndUser(project, appUser);
            allocation.setMember(member);
            allocationRepository.save(allocation);
        }
        return new ResponseEntity(HttpStatus.CREATED);
    }
}
