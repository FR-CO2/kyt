/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.parameter;

import org.co2.kanban.repository.config.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.co2.kanban.repository.config.ParameterType;
import org.co2.kanban.repository.config.ParameterRepository;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/parameter")
public class ParameterController {

    @Autowired
    private ParameterRepository repository;

    @Autowired
    private ParameterByCategoryAssembler assemblerByCategory;

    @Autowired
    private ParameterAssembler assembler;

   @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<ParameterByCategoryResource> query() {
        return assemblerByCategory.filterByCategory(repository.findAll());
    }

    @RequestMapping(value = "/{category}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<ParameterResource> get(@PathVariable("category") ParameterType category) {
        return assembler.toResources(repository.findByCategory(category));
    }

    @RequestMapping(value = "/{category}/{key}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ParameterResource getByName(@PathVariable("category") ParameterType category,
            @PathVariable("key") String keyConfig) {
        return assembler.toResource(repository.findByCategoryAndKeyParam(category, keyConfig));
    }

    @RequestMapping(value = "/{category}/{key}", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity update(@RequestBody Parameter config) {
        Parameter result = repository.save(config);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
