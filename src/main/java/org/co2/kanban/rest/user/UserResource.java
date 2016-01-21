/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user;

import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRole;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class UserResource extends IdentifiableResourceSupport<ApplicationUser> {

    
    public UserResource(ApplicationUser user) {
        super(user);
    }

    public String getUsername() {
        return this.getBean().getUsername();
    }

    public String getEmail() {
        return this.getBean().getEmail();
    }

    public ApplicationUserRole getApplicationRole() {
        return this.getBean().getApplicationRole();
    }

}
