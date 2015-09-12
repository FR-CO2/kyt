/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.task;

import org.co2.kanban.ControllerViews;
import org.co2.kanban.project.Project;
import org.co2.kanban.project.ProjectRepository;
import org.co2.kanban.project.state.State;
import org.co2.kanban.project.state.StateRepository;
import org.co2.kanban.project.category.Category;
import org.co2.kanban.project.category.CategoryRepository;
import org.co2.kanban.project.security.Member;
import org.co2.kanban.project.security.MemberRepository;
import org.co2.kanban.project.swimlane.Swimlane;
import org.co2.kanban.project.swimlane.SwimlaneRepository;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;
import javax.servlet.http.Part;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping(value = "/api/project/{projectId}/task")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class TaskController {

    @Autowired
    private TaskRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private StateRepository taskStateRepository;

    @Autowired
    private SwimlaneRepository swimlaneRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MemberRepository memberRepository;

    @RequestMapping(value = "page", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.TaskList.class)
    public Page<Task> projectPage(@PathVariable("projectId") Long projectId, Pageable p) {
        Project project = projectRepository.findOne(projectId);
        return repository.findByProject(project, p);
    }

    @RequestMapping(value = "kanban", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.TaskList.class)
    public Iterable<Task> kanbanList(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return repository.findByProjectAndStateKanbanHideFalse(project);
    }

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.TaskList.class)
    public Iterable<Task> projectList(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return repository.findByProject(project);
    }

    @RequestMapping(value = "export", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @JsonView(ControllerViews.TaskList.class)
    public FileSystemResource handleFileDownload(@PathVariable("projectId") Long projectId) throws IOException {
        Project project = projectRepository.findOne(projectId);
        CsvMapper mapper = new CsvMapper();
        CsvSchema schema = mapper.schemaFor(Task.class);
        ObjectWriter writer = mapper.writer(schema.withLineSeparator("\n"));
        File exportTasks = new File("export-tasks.csv");
        Iterable<Task> tasks = repository.findByProject(project);
        writer.writeValue(exportTasks, tasks);
        return new FileSystemResource(exportTasks);
    }

    @RequestMapping(value = "import", method = RequestMethod.POST, consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
    public ResponseEntity handleFileUpload(@PathVariable("projectId") Long projectId, @RequestParam(value = "importfile", required = false) Part file) throws IOException {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.Task.class)
    public Task get(@PathVariable("id") Long taskId) {
        return repository.findOne(taskId);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.Task.class)
    @PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
    public ResponseEntity<Task> create(@PathVariable("projectId") Long projectId, @RequestBody TaskForm newTask) {
        Task result = repository.save(convertTaskForm(projectId, newTask));
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@projectAccessExpression.hasContributorAccess(#projectId, principal.username)")
    public ResponseEntity delete(@PathVariable("id") Long id) {
        repository.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "{id}/state/{stateId}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateState(@PathVariable("id") Long id, @PathVariable("stateId") Long stateId) {
        State state = taskStateRepository.findOne(stateId);
        Task task = repository.findOne(id);
        if (state == null || task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        task.setState(state);
        repository.save(task);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "{id}/swimlane/{swimlaneId}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateSwimlane(@PathVariable("id") Long id, @PathVariable("swimlaneId") Long swimlaneId) {
        Swimlane swimlane = swimlaneRepository.findOne(swimlaneId);
        Task task = repository.findOne(id);
        if (swimlane == null || task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        task.setSwimlane(swimlane);
        repository.save(task);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "{id}/swimlane", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity removeSwimlane(@PathVariable("id") Long id) {
        Task task = repository.findOne(id);
        if (task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        task.setSwimlane(null);
        repository.save(task);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "{id}/close", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity close(@PathVariable("id") Long id) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "{id}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    @JsonView(ControllerViews.Task.class)
    public ResponseEntity<Task> update(@PathVariable("projectId") Long projectId, @PathVariable("id") Long taskId, @RequestBody TaskForm editTask) {
        Task result = repository.save(convertTaskForm(projectId, editTask));
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    private Task convertTaskForm(Long projectId, TaskForm form) {
        Task result = new Task();
        Task oldTask;
        result.setId(form.getId());
        if (form.getId() == null) {
            result.setCreated(new Timestamp(new Date().getTime()));
        } else {
            oldTask = repository.findOne(form.getId());
            result.setCreated(oldTask.getCreated());
            //TODO Historiser modification
            result.setLastModified(new Timestamp(new Date().getTime()));
        }
        result.setName(form.getName());
        result.setDescription(form.getDescription());
        Project project = projectRepository.findOne(projectId);
        result.setProject(project);
        State state = taskStateRepository.findByProjectAndPosition(project, 0L);
        if (form.getStateId() != null) {
            state = taskStateRepository.findOne(form.getStateId());
        }
        result.setState(state);
        if (form.getSwimlaneId() != null) {
            Swimlane swimlane = swimlaneRepository.findOne(form.getSwimlaneId());
            result.setSwimlane(swimlane);
        }
        if (form.getCategoryId() != null) {
            Category category = categoryRepository.findOne(form.getCategoryId());
            result.setCategory(category);
        }
        if (form.getAssigneeId() != null) {
            Member assignee = memberRepository.findOne(form.getAssigneeId());
            result.setAssignee(assignee);
        }
        if (form.getBackupId() != null) {
            Member backup = memberRepository.findOne(form.getBackupId());
            result.setBackup(backup);
        }
        result.setPlannedStart(form.getPlannedStart());
        result.setPlannedEnding(form.getPlannedEnding());
        result.setEstimatedLoad(form.getEstimatedLoad());
        return result;
    }
}