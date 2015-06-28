/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.category;

import com.cgi.fgdc.bdx.kanban.project.Project;
import com.cgi.fgdc.bdx.kanban.project.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
public class CategoryController {

    @Autowired
    private CategoryRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Category> list(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return repository.findByProject(project);
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Category> create(@PathVariable("projectId") Long projectId, @RequestBody Category category) {
        Project project = projectRepository.findOne(projectId);
        category.setProject(project);
        Category result = repository.save(category);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
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
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
