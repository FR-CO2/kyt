/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.business.project.task.history;

import java.security.Principal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.co2.kanban.business.project.history.HistoryUser;
import org.co2.kanban.business.project.type.action.EnumAction;
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
    private TaskHistoAssembler taskHistoAssembler;

    @Autowired
    private ApplicationUserRepository applicationUserRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

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
        String sort = "DESC";
        Sort.Direction dir = Sort.Direction.DESC;
        Sort sorting = new Sort(dir, sort);
        PageRequest pageable = new PageRequest(1, 1, sorting);
        TaskHisto taskHisto = new TaskHisto();
        List<TaskHisto> tasksHisto = taskHistoRepository.findTop1ByTaskId(task.getId(), 10);
        taskHisto.setVersionId(0L);
        if (tasksHisto.size() > 0) {
            taskHisto.setVersionId(tasksHisto.get(0).getVersionId() + 1);
        }

        Date date = new Date();
        taskHisto.setDateModif(new Timestamp(date.getTime()));
        taskHisto.setTaskId(task.getId());

        ApplicationUser appUser = applicationUserRepository.findByUsername(user.getName());
        taskHisto.setUserIdWriter(appUser.getId());
        taskHisto.setUsernameWriter(appUser.getUsername());
        taskHisto.setActionValue(action.getValue());

        taskHistoRepository.save(taskHisto);
    }
}
