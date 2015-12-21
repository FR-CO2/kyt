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
import org.springframework.beans.factory.annotation.Autowired;
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
@PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
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
    public ResponseEntity<CategoryResource> get(@PathVariable("id") Long id) {
        Category category = repository.findOne(id);
        return new ResponseEntity(assembler.toResource(category), HttpStatus.OK);
    }
    
    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Category> create(@PathVariable("projectId") Long projectId, @RequestBody Category category) {
        Project project = projectRepository.findOne(projectId);
        category.setProject(project);
        repository.save(category);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "{categoryId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("categoryId") Long categoryId) {
        repository.delete(categoryId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "{categoryId}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity update(@PathVariable("projectId") Long projectId, @RequestBody Category category) {
        Project project = projectRepository.findOne(projectId);
        category.setProject(project);
        Category result = repository.save(category);
        return new ResponseEntity<>(assembler.toResource(result), HttpStatus.OK);
    }
}
