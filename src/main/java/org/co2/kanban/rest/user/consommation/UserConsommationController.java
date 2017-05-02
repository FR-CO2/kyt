/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user.consommation;

import java.security.Principal;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import org.co2.kanban.business.project.task.history.Archivable;
import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.repository.allocation.AllocationRepository;
import org.co2.kanban.repository.config.Parameter;
import org.co2.kanban.repository.member.ProjectMember;
import org.co2.kanban.repository.member.ProjectMemberRepository;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.co2.kanban.repository.config.ParameterRepository;
import org.co2.kanban.repository.config.ParameterType;
import org.co2.kanban.rest.error.BusinessException;

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
    private ProjectMemberRepository memberRepository;

    @Autowired
    private TaskRepository taskRepositoy;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private ParameterRepository parameterRepository;

    private static final String MAX_ALLOCATION = "max";
    private static final String MESSAGE_KEY_ALLOCATION_MAX = "user.consommation.error.max";

    /**
     * This function permits to get the timestamp and to cast into GMT with 00:00:00. It is necessary to get the allocations
     *
     * @param date
     * @return
     * @throws ParseException
     */
    private Long formatToGMT(Long date) throws ParseException {
        SimpleDateFormat formatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
        String strDateString = formatter.format(date);

        formatter.applyPattern("dd MMM yyyy HH:mm:ss");

        Date scheduleTime =  formatter.parse(strDateString);
        Calendar cal = Calendar.getInstance();
        cal.setTime(scheduleTime);

        Calendar calGMT = cal;
        calGMT.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH),0, 0, 0);
        //calGMT.setTimeZone(TimeZone.getTimeZone("UTC"));

        return calGMT.getTime().getTime();
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<UserTaskImputationResource> list(@PathVariable("userId") Long userId,
            @RequestParam("date") Long date) throws ParseException {
        ApplicationUser appUser = repository.findOne(userId);
        long oneDay = 1 * 24 * 60 * 60 * 1000;
        Long dateMoreOneDay = date + oneDay;
        Long dateLessOneDay = date - oneDay;

        Timestamp time = new Timestamp(formatToGMT(date));
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

        results = new ArrayList<>(mapTemp.values());
        return results;
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Archivable
    public ResponseEntity create(@AuthenticationPrincipal Principal user, @PathVariable("userId") Long userId,
            @RequestParam("date") Long date,
            @RequestBody UserTaskImputationResource[] imputations
    ) throws ParseException {
        ApplicationUser appUser = repository.findOne(userId);
        Parameter max = parameterRepository.findByCategoryAndKeyParam(ParameterType.ALLOCATION, MAX_ALLOCATION);
        Double sumImputation = 0D;
        for (UserTaskImputationResource imputation : imputations) {
            sumImputation += imputation.getTimeSpent();
        }
        // If sumImputation is sup to max, the user entered a bad allocation
        if (Double.compare(sumImputation, Double.parseDouble(max.getValueParam())) == 1) {
            throw new BusinessException(HttpStatus.PRECONDITION_FAILED, MESSAGE_KEY_ALLOCATION_MAX, new Object[]{max.getValueParam()});
        }
        Timestamp time = new Timestamp(formatToGMT(date));
        for (UserTaskImputationResource imputation : imputations) {
            Task task = taskRepositoy.findOne(imputation.getTaskId());
            Project project = task.getProject();
            createAllocation(project.getId(), user, appUser, task, imputation, time);
        }
        return new ResponseEntity(HttpStatus.CREATED);
    }

    @Archivable
    public Task createAllocation(Long projectId, Principal user, ApplicationUser appUser, Task task, UserTaskImputationResource imputation, Timestamp time) {
        Project project = task.getProject();
        ProjectMember member = memberRepository.findByProjectAndUser(project, appUser);
        Allocation allocation = allocationRepository.findByMemberUserAndAllocationDateAndTask(appUser, time, task);
        if (allocation == null) {
            allocation = new Allocation();
            allocation.setTask(task);
            allocation.setMember(member);
            allocation.setAllocationDate(time);
        }
        allocation.setTimeSpent(imputation.getTimeSpent());
        allocation.setTimeRemains(imputation.getTimeRemains());
        if ((imputation.getTimeSpent() == null || imputation.getTimeSpent() == 0F) &&
                (imputation.getTimeRemains() == null || imputation.getTimeRemains() == 0F)) {
            allocationRepository.delete(allocation);
        } else {
            allocationRepository.save(allocation);
        }
        return task;
    }
}
