/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task.allocation;

import org.co2.kanban.repository.allocation.AllocationRepository;
import org.co2.kanban.repository.allocation.Allocation;
import java.security.Principal;
import org.co2.kanban.repository.member.MemberRepository;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping(value = "/api/project/{projectId}/task/{taskId}/allocation")
public class AllocationController {

    @Autowired
    private TaskRepository repository;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private ApplicationUserRepository userRepository;
    
    @Autowired
    private MemberRepository memberRepository;

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Allocation> create(@AuthenticationPrincipal Principal user,
            @PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId, @RequestBody AllocationForm allocationForm) {
        ApplicationUser currentUser = userRepository.findByUsername(user.getName());
        Task task = repository.findOne(taskId);
        Member currentMember = memberRepository.findByProjectAndUser(task.getProject(), currentUser);
        Allocation newAllocation = allocationRepository.findByTaskAndAllocationDateAndMember(task, allocationForm.getAllocationDate(), currentMember);
        if (newAllocation == null) {
            newAllocation = new Allocation();
        }
        newAllocation.setMember(currentMember);
        newAllocation.setAllocationDate(allocationForm.getAllocationDate());
        newAllocation.setTimeRemains(allocationForm.getTimeRemains());
        newAllocation.setTimeSpent(allocationForm.getTimeSpent());
        newAllocation.setTask(task);
        if (newAllocation.getTimeRemains() != null || newAllocation.getTimeSpent() != null) {
            allocationRepository.save(newAllocation);
            return new ResponseEntity(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Allocation> list(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId) {
        Task task = repository.findOne(taskId);
        return allocationRepository.findByTask(task);
    }
}