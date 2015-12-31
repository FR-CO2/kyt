/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.category;

import org.co2.kanban.repository.category.Category;
import org.co2.kanban.rest.project.ProjectController;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class CategoryAssembler extends ResourceAssemblerSupport<Category, CategoryResource> {

    public CategoryAssembler() {
        super(CategoryController.class, CategoryResource.class);
    }

    @Override
    public CategoryResource toResource(Category category) {
        CategoryResource resource = new CategoryResource(category);
        resource.add(linkTo(methodOn(CategoryController.class).get(category.getProject().getId(), category.getId())).withSelfRel());
        resource.add(linkTo(methodOn(ProjectController.class).get(category.getProject().getId())).withRel("project"));
        return resource;
    }
}
