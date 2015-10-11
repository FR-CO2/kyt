/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.task.allocation;

import java.security.Principal;
import org.co2.kanban.project.security.MemberRepository;
import java.sql.Timestamp;
import java.util.Date;
import org.co2.kanban.project.task.Task;
import org.co2.kanban.project.task.TaskRepository;
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
    private MemberRepository memberRepository;

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Allocation> create(@AuthenticationPrincipal Principal user,
            @PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId, @RequestBody AllocationForm allocationForm) {
        Allocation newAllocation = new Allocation();
        newAllocation.setMember(memberRepository.findByProjectIdAndUserUsername(projectId, user.getName()));
        newAllocation.setAllocationDate(new Timestamp(new Date().getTime()));
        newAllocation.setTimeRemains(allocationForm.getTimeRemains());
        newAllocation.setTimeSpent(allocationForm.getTimeSpent());
        Task task = repository.findOne(taskId);
        newAllocation.setTask(task);
        Long maxPosition = allocationRepository.getProjectMaxPosition(projectId);
        if (maxPosition == null) {
            maxPosition = 0L;
        }
        newAllocation.setId(maxPosition);
        allocationRepository.save(newAllocation);
        return new ResponseEntity(HttpStatus.CREATED);
    }

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Allocation> list(@PathVariable("projectId") Long projectId, @PathVariable("taskId") Long taskId) {
      
        return allocationRepository.findByTaskId(taskId);
    }
}
