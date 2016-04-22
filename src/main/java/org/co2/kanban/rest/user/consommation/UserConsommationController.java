/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user.consommation;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
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

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<UserTaskImputationResource> list(@PathVariable("userId") Long userId,
            @RequestParam("date") Long date) {
        ApplicationUser appUser = repository.findOne(userId);
        long oneDay = 1 * 24 * 60 * 60 * 1000;
        Long dateMoreOneDay = date + oneDay;
        Long dateLessOneDay = date - oneDay;
        Timestamp time = new Timestamp(date);
        Timestamp timeMoreOneDay = new Timestamp(dateMoreOneDay);
        Timestamp timeLessOneDay = new Timestamp(dateLessOneDay);
        List<UserTaskImputationResource> results;
        Map<Long, UserTaskImputationResource> mapTemp = new HashMap<>();
        Iterable<Allocation> allocations = allocationRepository.findByMemberUserAndAllocationDate(appUser, time);
        Iterator<Allocation> allocationsIterator = allocations.iterator();
        Iterable<Task> tasks = taskRepositoy.findByAssigneesUserAndPlannedStartBeforeAndPlannedEndingAfterAndStateCloseStateFalse(appUser, timeMoreOneDay, timeLessOneDay);
        for (Task task : tasks) {
            UserTaskImputationResource resource = new UserTaskImputationResource(task);
            while (allocationsIterator.hasNext()) {
                Allocation allocation = allocationsIterator.next();
                if (task.equals(allocation.getTask())) {
                    resource.setTimeRemains(allocation.getTimeRemains());
                    resource.setTimeSpent(allocation.getTimeSpent());
                    allocationsIterator.remove();
                }
            }
            if (resource.getTimeRemains() == null) {
                //TODO récuperer le RAF au lieu de a charge estimée
                resource.setTimeRemains(task.getEstimatedLoad());
            }
            mapTemp.put(resource.getTaskId(), resource);
        }
        for (Allocation allocation : allocations) {
            UserTaskImputationResource resource = new UserTaskImputationResource(allocation.getTask());

            if (resource.getTimeRemains() == null) {
                if (allocation.getTimeRemains() != null) {
                    resource.setTimeRemains(allocation.getTimeRemains());
                } else {
                    resource.setTimeRemains(allocation.getTask().getEstimatedLoad());
                }
            }
            resource.setTimeSpent(allocation.getTimeSpent());
            if (mapTemp.get(resource.getTaskId()) == null) {
                mapTemp.put(resource.getTaskId(), resource);
            } else {
                mapTemp.replace(resource.getTaskId(), resource);
            }
        }

        results = new ArrayList<UserTaskImputationResource>(mapTemp.values());
        return results;
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity create(@PathVariable("userId") Long userId,
            @RequestParam("date") Long date,
            @RequestBody UserTaskImputationResource[] imputations
    ) {
        ApplicationUser appUser = repository.findOne(userId);
        Timestamp time = new Timestamp(date);
        for (UserTaskImputationResource imputation : imputations) {
            Task task = taskRepositoy.findOne(imputation.getTaskId());
            Project project = task.getProject();
            Member member = memberRepository.findByProjectAndUser(project, appUser);
            Allocation allocation = allocationRepository.findByMemberUserAndAllocationDateAndTask(appUser, time, task);
            if (allocation == null) {
                allocation = new Allocation();
                allocation.setTask(task);
                allocation.setMember(member);
                allocation.setAllocationDate(time);
            }
            Float timeSpent = 0F;
            Float timeRemains = 0F;
            if(imputation.getTimeSpent() != null){
                timeSpent = imputation.getTimeSpent();
            }
            if(imputation.getTimeRemains() != null){
                timeRemains = imputation.getTimeRemains();
            }
            allocation.setTimeSpent(timeSpent);
            allocation.setTimeRemains(timeRemains);
            allocationRepository.save(allocation);
        }
        return new ResponseEntity(HttpStatus.CREATED);
    }
}
