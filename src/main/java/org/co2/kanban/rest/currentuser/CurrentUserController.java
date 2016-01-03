/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.currentuser;

import org.co2.kanban.repository.user.ApplicationUserRepository;
import java.security.Principal;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.rest.user.UserAssembler;
import org.co2.kanban.rest.user.UserResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
@RequestMapping(value = "/api/userProfile")
public class CurrentUserController {

    @Autowired
    private ApplicationUserRepository userRepository;

    @Autowired
    private CurrentUserAssembler userAssembler;

    private final BCryptPasswordEncoder bcryptEncoder = new BCryptPasswordEncoder();
    
    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public UserResource getCurrentUser(@AuthenticationPrincipal Principal user) {
        return userAssembler.toResource(userRepository.findByUsername(user.getName()));
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity update(@AuthenticationPrincipal Principal currentuser, @RequestBody ApplicationUser user) {
        ApplicationUser updatedUser = userRepository.findByUsername(currentuser.getName());
        if (user.getPassword() != null) {
            String passwordDigest = bcryptEncoder.encode(user.getPassword());
            updatedUser.setPassword(passwordDigest);
        }
        updatedUser.setEmail(user.getEmail());
        userRepository.save(updatedUser);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
