/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.task.TaskRepository;
import org.co2.kanban.repository.taskfield.TaskField;
import org.co2.kanban.repository.taskfield.TaskFieldRepository;
import org.co2.kanban.repository.taskfield.TaskFieldType;
import org.co2.kanban.rest.error.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public TaskResource update(@PathVariable("projectId") Long projectId, @PathVariable("id") Long taskId, @Validated @RequestBody Task task) {
        Project project = projectRepository.findOne(projectId);
        task.setProject(project);
        if (task.getCustomField() != null) {
            checkCustomFields(task.getCustomField());
            saveCustomFields(task.getId(), task.getCustomField());
        }
        Task result = repository.save(task);
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
            }else if(field.getDefinition().getRequired() != null && field.getDefinition().getRequired()){
                throw new BusinessException(HttpStatus.PRECONDITION_FAILED, MESSAGE_FIELD_REQUIRED);
            }
        }
    }
}
