/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project;

import org.co2.kanban.repository.member.ProjectRole;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.rest.project.category.CategoryController;
import org.co2.kanban.rest.project.state.StateController;
import org.co2.kanban.rest.project.swimlane.SwimlaneController;
import org.co2.kanban.rest.project.task.TaskListController;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.co2.kanban.rest.project.member.MemberController;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class ProjectAssembler extends ResourceAssemblerSupport<Project, ProjectResource> {

    public ProjectAssembler() {
        super(ProjectController.class, ProjectResource.class);
    }

    @Override
    public ProjectResource toResource(Project project) {
        ProjectResource resource = new ProjectResource(project);
        resource.add(linkTo(methodOn(MemberController.class).list(project.getId())).withRel("member"));
        resource.add(linkTo(methodOn(StateController.class).projectList(project.getId())).withRel("state"));
        resource.add(linkTo(methodOn(SwimlaneController.class).projectList(project.getId())).withRel("swimlane"));
        resource.add(linkTo(methodOn(CategoryController.class).list(project.getId())).withRel("category"));
        resource.add(linkTo(TaskListController.class, project.getId()).withRel("task"));
        resource.add(linkTo(methodOn(ProjectController.class).get(project.getId())).withSelfRel());
        resource.add(linkTo(methodOn(ProjectController.class).roles(project.getId())).withRel("roles"));
        return resource;
    }

}
