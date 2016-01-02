/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user;

import java.security.Principal;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.co2.kanban.rest.error.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.MultiValueMap;
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
@RequestMapping(value = "/api/user")
public class ApplicationUserController {

    @Autowired
    private ApplicationUserRepository repository;

    @Autowired
    private UserAssembler userAssembler;

    @Autowired
    private PagedResourcesAssembler<ApplicationUser> pagedAssembler;

    private final BCryptPasswordEncoder bcryptEncoder = new BCryptPasswordEncoder();

    @RequestMapping(params = {"page", "size"}, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<UserResource> page(
            @RequestParam(name = "page") Integer page,
            @RequestParam(name = "size", required = false) Integer size) {
        Pageable pageable = new PageRequest(page, size);
        return pagedAssembler.toResource(repository.findAll(pageable), userAssembler);
    }

    @RequestMapping(params = {"search"}, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<UserResource> search(@RequestParam(name = "search") String search) {
        return userAssembler.toResources(repository.findByUsernameContains(search));
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResource> create(@RequestBody ApplicationUser newUser) {
        if (repository.checkExistUsername(newUser.getUsername())) {
            throw new BusinessException(HttpStatus.CONFLICT, "user.error.conflict.username");
        }
        String passwordDigest = bcryptEncoder.encode(newUser.getPassword());
        newUser.setPassword(passwordDigest);
        ApplicationUser user = repository.save(newUser);
        MultiValueMap<String, String> headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, linkTo(methodOn(ApplicationUserController.class).get(user.getId())).toString());
        ResponseEntity resp = new ResponseEntity(headers, HttpStatus.CREATED);
        return resp;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResource> get(@PathVariable("id") Long userId) {
        return new ResponseEntity<>(userAssembler.toResource(repository.findOne(userId)), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@AuthenticationPrincipal Principal user, @PathVariable("id") Long userId) {
        ApplicationUser currentUser = repository.findByUsername(user.getName());
        if (currentUser.getId().equals(userId)) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }
        repository.delete(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity update(@PathVariable("id") Long userId, @RequestBody ApplicationUser user) {
        ApplicationUser updatedUser = repository.findOne(userId);
        updatedUser.setApplicationRole(user.getApplicationRole());
        updatedUser.setEmail(user.getEmail());
        repository.save(updatedUser);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
