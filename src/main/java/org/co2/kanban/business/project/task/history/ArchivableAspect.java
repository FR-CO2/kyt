/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.business.project.task.history;

import java.security.Principal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.co2.kanban.business.project.history.HistoryUser;
import org.co2.kanban.business.project.type.action.EnumAction;
import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.repository.member.ProjectMemberRepository;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.taskhisto.TaskHisto;
import org.co2.kanban.repository.taskhisto.TaskHistoRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.co2.kanban.rest.project.task.histo.TaskHistoAssembler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 *
 * @author stan
 */
@Service
@Aspect
public class ArchivableAspect {

    @Autowired
    private ApplicationUserRepository applicationUserRepository;

    @Autowired
    private TaskHistoRepository taskHistoRepository;

    @Autowired
    private TaskRepository taksRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @AfterReturning(pointcut = "@annotation(org.co2.kanban.business.project.task.history.Archivable) && args(projectId, user, ..)",
            returning = "result")
    public void majTaskHisto(JoinPoint jp, Long projectId, Principal user, Object result) throws Throwable {

        Project project = projectRepository.findOne(projectId);
        Long taskId;
        Task task;
        EnumAction action;
        try {
            taskId = (Long) jp.getArgs()[2];
            
            try{
                ResponseEntity response = (ResponseEntity) result;
                action = EnumAction.DELETED;
            } catch(ClassCastException ex){
                action = EnumAction.UPDATE;
            }
        } catch (ClassCastException ex) {
            ResponseEntity response = (ResponseEntity) result;
            HttpHeaders headers = response.getHeaders();
            taskId = Long.valueOf(headers.get("taskId").get(0));
            action = EnumAction.INSERT;
        }
        task = taksRepository.findOne(taskId);
        Float totalAllocations = 0F;
        List<Allocation> allocations = task.getAllocations();
        if(allocations != null) {
            for (Allocation allocation : allocations) {
                totalAllocations += allocation.getTimeSpent();
            }
        }
        String sort = "DESC";
        Sort.Direction dir = Sort.Direction.DESC;
        TaskHisto taskHisto = new TaskHisto();
        TaskHisto lastTaskHisto = new TaskHisto();

        List<TaskHisto> tasksHisto = taskHistoRepository.findTop1ByTaskId(task.getId(), 1,1);
        taskHisto.setId("0");
        taskHisto.setVersionId("0");

        if(tasksHisto.size() > 0) {
            taskHisto.setId(tasksHisto.get(0).getId());
            Integer numVersion = Integer.parseInt(tasksHisto.get(0).getVersionId()) + 1;
            taskHisto.setVersionId(numVersion.toString());
            lastTaskHisto = tasksHisto.get(0);
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        taskHisto.setDateModif(dateFormat.format(new Date()));
        taskHisto.setTaskId(task.getId().toString());
        taskHisto.setProjectId(project.getId().toString());
        taskHisto.setProjectName(project.getName());
        if(task.getState() != null) {
            taskHisto.setStateId(task.getState().getId().toString());
            taskHisto.setStateName(task.getState().getName());
        }
        if(task.getSwimlane() != null){
            taskHisto.setSwinlameId(task.getSwimlane().getId().toString());
            taskHisto.setSwinlameName(task.getSwimlane().getName());
        }
        if(task.getCategory() != null){
            taskHisto.setCategoryId(task.getCategory().getId().toString());
            taskHisto.setCategoryName(task.getCategory().getName());
        }

        taskHisto.setTotalAllocations(totalAllocations.toString());

        ApplicationUser appUser = applicationUserRepository.findByUsername(user.getName());
        taskHisto.setUserIdWriter(appUser.getId().toString());
        taskHisto.setUsernameWriter(appUser.getUsername());
        taskHisto.setActionValue(String.valueOf(action.getValue()));
        if(!lastTaskHisto.equals(taskHisto)) {
            taskHistoRepository.save(taskHisto);
        }
    }
}
