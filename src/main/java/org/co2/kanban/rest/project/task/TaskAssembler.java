/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.task;

import org.co2.kanban.repository.category.CategoryRepository;
import org.co2.kanban.repository.member.MemberRepository;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.state.StateRepository;
import org.co2.kanban.repository.swimlane.SwimlaneRepository;
import org.co2.kanban.rest.project.ProjectController;
import org.co2.kanban.rest.project.category.CategoryController;
import org.co2.kanban.rest.project.member.MemberController;
import org.co2.kanban.rest.project.state.StateController;
import org.co2.kanban.rest.project.swimlane.SwimlaneController;
import org.co2.kanban.repository.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class TaskAssembler extends ResourceAssemblerSupport<Task, TaskResource> {

    @Autowired
    private StateRepository taskStateRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SwimlaneRepository swimlaneRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public TaskAssembler() {
        super(TaskController.class, TaskResource.class);
    }

    @Override
    public TaskResource toResource(Task task) {
        TaskResource resource = instantiateResource(task);
        resource.setResourceId(task.getId());
        resource.setName(task.getName());
        resource.setCreated(task.getCreated());
        resource.setDescription(task.getDescription());
        resource.setEstimatedLoad(task.getEstimatedLoad());
        resource.setPlannedEnding(task.getPlannedEnding());
        resource.setPlannedStart(task.getPlannedStart());
        //TODO report calcul time remains & time spent
        resource.setTimeRemains(0F);
        resource.setTimeSpent(0F);
        resource.add(linkTo(methodOn(ProjectController.class).get(task.getProject().getId())).withRel("project"));
        resource.setStateId(task.getState().getId());
        resource.add(linkTo(methodOn(StateController.class, task.getProject().getId()).get(resource.getStateId())).withRel("state"));
        resource.add(linkTo(methodOn(TaskController.class, task.getProject().getId(), task.getId()).get(task.getId())).withSelfRel());
        if (task.getAssignee() != null) {
            resource.setAssigneeId(task.getAssignee().getId());
            resource.add(linkTo(methodOn(MemberController.class, task.getProject().getId()).get(resource.getAssigneeId())).withRel("assignee"));
        }
        if (task.getBackup() != null) {
            resource.setBackupId(task.getBackup().getId());
            resource.add(linkTo(methodOn(MemberController.class, task.getProject().getId()).get(resource.getBackupId())).withRel("backup"));
        }
        if (task.getSwimlane() != null) {
            resource.setSwimlaneId(task.getSwimlane().getId());
            resource.add(linkTo(methodOn(SwimlaneController.class, task.getProject().getId()).get(resource.getSwimlaneId())).withRel("swimlane"));
        }
        if (task.getCategory() != null) {
            resource.setCategoryId(task.getCategory().getId());
            resource.add(linkTo(methodOn(CategoryController.class, task.getProject().getId()).get(resource.getCategoryId())).withRel("category"));
        }
        return resource;
    }

    public void updateEntity(Task task, Long projectId, TaskResource resource) {
        task.setName(resource.getName());
        task.setCreated(resource.getCreated());
        task.setDescription(resource.getDescription());
        task.setEstimatedLoad(resource.getEstimatedLoad());
        task.setPlannedEnding(resource.getPlannedEnding());
        task.setPlannedStart(resource.getPlannedStart());
        Project project = projectRepository.findOne(projectId);
        task.setProject(project);
        if (resource.getStateId() != null) {
            task.setState(taskStateRepository.findOne(resource.getStateId()));
        } else {
            task.setState(taskStateRepository.findByProjectAndPosition(project, 0L));
        }
        if (resource.getAssigneeId() != null) {
            task.setAssignee(memberRepository.findOne(resource.getAssigneeId()));
        }
        if (resource.getBackupId() != null) {
            task.setBackup(memberRepository.findOne(resource.getBackupId()));
        }
        if (resource.getSwimlaneId() != null) {
            task.setSwimlane(swimlaneRepository.findOne(resource.getSwimlaneId()));
        }
        if (resource.getCategoryId() != null) {
            task.setCategory(categoryRepository.findOne(resource.getCategoryId()));
        }
    }

}
