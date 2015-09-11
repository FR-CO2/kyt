/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.task.allocation;

import org.co2.kanban.project.security.MemberRepository;
import org.co2.kanban.project.swimlane.Swimlane;
import java.sql.Timestamp;
import java.util.Date;
import org.co2.kanban.project.task.Task;
import org.co2.kanban.project.task.TaskForm;
import org.co2.kanban.project.task.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping(value = "/api/project/{projectId}/allocation")
public class AllocationController {

    @Autowired
    private TaskRepository repository;
    
    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private MemberRepository memberRepository;
   
    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Allocation> create(@PathVariable("projectId") Long projectId, @RequestBody TaskForm taskForm) {
        Allocation newAllocation = new Allocation();
        newAllocation.setTimeRemains(taskForm.getTimeRemains());
        newAllocation.setTimeSpent(taskForm.getTimeSpent());
        if(taskForm.getId()!= null){
            Task task = repository.findOne(taskForm.getId());
            newAllocation.setTask(task);
        }
                
        Long maxPosition = allocationRepository.getProjectMaxPosition(projectId);

        newAllocation.setMember(memberRepository.findOne(1L)); 
        
        newAllocation.setAllocationDate(new Timestamp(new Date().getTime()));
        
        if (maxPosition == null) {
            maxPosition = 0L;
        }
        newAllocation.setId(maxPosition);
        allocationRepository.save(newAllocation);
        return new ResponseEntity(newAllocation, HttpStatus.CREATED);
    }
}
