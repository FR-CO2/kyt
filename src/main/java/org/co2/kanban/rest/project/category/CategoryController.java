/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.category;

import org.co2.kanban.repository.category.Category;
import org.co2.kanban.repository.category.CategoryRepository;
import java.util.List;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping(value = "/api/project/{projectId}/category")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class CategoryController {

    @Autowired
    private CategoryRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private CategoryAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public List<CategoryResource> list(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return assembler.toResources(repository.findByProject(project));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CategoryResource> get(@PathVariable("projectId") Long projectId, @PathVariable("id") Long id) {
        Category category = repository.findOne(id);
        return new ResponseEntity(assembler.toResource(category), HttpStatus.OK);
    }

    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity create(@PathVariable("projectId") Long projectId, @RequestBody Category category) {
        Project project = projectRepository.findOne(projectId);
        if (repository.checkExistProjectAndName(project, category.getName())) {
            return new ResponseEntity(HttpStatus.CONFLICT);
        }
        category.setProject(project);
        Category result = repository.save(category);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(linkTo(methodOn(this.getClass()).get(projectId, result.getId())).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    @RequestMapping(value = "{categoryId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("categoryId") Long categoryId) {
        Category category = repository.findOne(categoryId);
        for (Task task : category.getTasks()) {
            task.setCategory(null);
        }
        repository.delete(category);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    @RequestMapping(value = "{categoryId}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CategoryResource> update(@PathVariable("projectId") Long projectId, @RequestBody Category category) {
        Project project = projectRepository.findOne(projectId);
        Category oldCategory = repository.findOne(category.getId());
        if (!oldCategory.getName().equals(category.getName()) && repository.checkExistProjectAndName(project, category.getName())) {
            return new ResponseEntity(HttpStatus.CONFLICT);
        }
        category.setProject(project);
        Category result = repository.save(category);
        return new ResponseEntity<>(assembler.toResource(result), HttpStatus.OK);
    }
}
