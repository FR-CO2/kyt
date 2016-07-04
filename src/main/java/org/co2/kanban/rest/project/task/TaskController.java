/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import com.google.gson.Gson;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.security.Principal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.co2.kanban.repository.member.ProjectMember;
import org.co2.kanban.repository.member.ProjectMemberRepository;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.taskfield.TaskField;
import org.co2.kanban.repository.taskfield.TaskFieldRepository;
import org.co2.kanban.repository.taskfield.TaskFieldType;
import org.co2.kanban.repository.taskhisto.TaskHisto;
import org.co2.kanban.repository.taskhisto.TaskHistoRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.co2.kanban.rest.error.BusinessException;
import org.co2.kanban.rest.project.task.histo.TaskHistoAssembler;
import org.co2.kanban.rest.project.task.histo.TaskHistoResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.serializer.Serializer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
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
@RequestMapping(value = "/api/project/{projectId}/task/{id}")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class TaskController {

    private static final String MESSAGE_KEY_NOT_FOUND = "project.task.error.notfound";
    private static final String MESSAGE_CAST_DATE_KO = "project.task.error.cast.date";
    private static final String MESSAGE_CAST_NUMBER_KO = "project.task.error.cast.number";
    private static final String MESSAGE_FIELD_REQUIRED = "project.task.error.field.required";

    @Autowired
    private TaskRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskAssembler assembler;

    @Autowired
    private TaskFieldRepository fieldRepository;

    @Autowired
    private TaskHistoRepository taskHistoRepository;

    @Autowired
    private TaskHistoAssembler taskHistoAssembler;

    @Autowired
    private ApplicationUserRepository applicationUserRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public TaskResource get(@PathVariable("projectId") Long projectId, @PathVariable("id") Long taskId) {
        Task task = repository.findOne(taskId);
        if (task == null) {
            throw new BusinessException(HttpStatus.NOT_FOUND, MESSAGE_KEY_NOT_FOUND);
        }
        return assembler.toResource(task);
    }

    @RequestMapping(method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("id") Long id) {
        Task task = repository.findOne(id);
        Iterable<TaskField> tasksField = fieldRepository.findByTask(task);
        fieldRepository.delete(tasksField);
        repository.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
    public TaskResource update(@PathVariable("projectId") Long projectId, @PathVariable("id") Long taskId,
            @AuthenticationPrincipal Principal user,
            @Validated @RequestBody Task task) throws IOException {
        Project project = projectRepository.findOne(projectId);
        task.setProject(project);
        if (task.getCustomField() != null) {
            checkCustomFields(task.getCustomField());
            saveCustomFields(task.getId(), task.getCustomField());
        }
        Task result = repository.save(task);
        taskHistoRepository.save(this.mappingTaskHisto(project, user, task));

        return assembler.toResource(result);
    }

    private void saveCustomFields(Long taskId, List<TaskField> fields) {
        Task currentTask = repository.findOne(taskId);
        for (TaskField field : fields) {
            field.setTask(currentTask);
        }
        fieldRepository.save(fields);
    }

    private void checkCustomFields(List<TaskField> fields) {
        for (TaskField field : fields) {
            if (field.getFieldValue() != null) {
                if (TaskFieldType.DATE.equals(field.getDefinition().getType())) {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                    try {
                        Date date = sdf.parse(field.getFieldValue());
                        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                        field.setFieldValue(format.format(date));
                    } catch (ParseException ex) {
                        throw new BusinessException(HttpStatus.PRECONDITION_FAILED, MESSAGE_CAST_DATE_KO);
                    }
                } else if (TaskFieldType.NUMBER.equals(field.getDefinition().getType())) {
                    try {
                        Integer i = Integer.parseInt(field.getFieldValue());
                        field.setFieldValue(i.toString());
                    } catch (NumberFormatException ex) {
                        throw new BusinessException(HttpStatus.PRECONDITION_FAILED, MESSAGE_CAST_NUMBER_KO);
                    }
                }
            } else if (field.getDefinition().getRequired() != null && field.getDefinition().getRequired()) {
                throw new BusinessException(HttpStatus.PRECONDITION_FAILED, MESSAGE_FIELD_REQUIRED);
            }
        }
    }

    /**
     * Fonction qui permet de transformer une tache en tache histo sous format
     * json
     *
     * @param task
     * @param user
     * @return
     * @throws IOException
     */
    private TaskHisto mappingTaskHisto(Project project, Principal user, Task task) throws IOException {
        String sort = "DESC";
        Sort.Direction dir = Sort.Direction.DESC;
        Sort sorting = new Sort(dir, sort);
        PageRequest pageable = new PageRequest(1, 1, sorting);
        TaskHisto taskHisto = new TaskHisto();
        Page<TaskHisto> page = taskHistoRepository.findTop1ByTaskId(task.getId(), pageable);
        taskHisto.setVersionId(0L);
        if (page.getTotalElements() > 0) {
            taskHisto.setVersionId(page.getContent().get(0).getVersionId() + 1);
        }
        ApplicationUser appuser = applicationUserRepository.findByUsername(user.getName());
        ProjectMember member = projectMemberRepository.findByProjectAndUser(project, appuser);
        Project projectHisto = new Project();
        projectHisto.setId(task.getProject().getId());
        projectHisto.setName(task.getProject().getName());
        task.setProject(projectHisto);
        Date date = new Date();
        taskHisto.setDateModif(new Timestamp(date.getTime()));
        taskHisto.setTask(task);

        ProjectMember projectMemberHisto = new ProjectMember();
        projectMemberHisto.setId(member.getId());
        ApplicationUser appUserHisto = new ApplicationUser();
        appUserHisto.setId(appuser.getId());
        appUserHisto.setUsername(appuser.getUsername());
        projectMemberHisto.setUser(appUserHisto);
        taskHisto.setAssignee(projectMemberHisto);
        TaskHistoResource taskHistoResource = taskHistoAssembler.toResource(taskHisto);

        Gson gson = new Gson();
        String json = gson.toJson(taskHistoResource);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ObjectOutputStream os = new ObjectOutputStream(out);
        os.writeObject(json);
        taskHisto.setFile(out.toByteArray());

        return taskHisto;
    }
}
