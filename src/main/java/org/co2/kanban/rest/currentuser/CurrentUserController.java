/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.currentuser;

import org.co2.kanban.repository.user.ApplicationUserRepository;
import java.security.Principal;
import org.co2.kanban.rest.user.UserAssembler;
import org.co2.kanban.rest.user.UserResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/")
public class CurrentUserController {

    @Autowired
    private ApplicationUserRepository userRepository;

    @Autowired
    private UserAssembler userAssembler;


    @RequestMapping(value = "userProfile", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public UserResource getCurrentUser(@AuthenticationPrincipal Principal user) {
        return userAssembler.toResource(userRepository.findByUsername(user.getName()));
    }

}
