/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member;

import org.co2.kanban.repository.member.ProjectRole;
import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 */
public class MemberResource extends ResourceSupport{
    
    private ProjectRole projectRole;

    public ProjectRole getProjectRole() {
        return projectRole;
    }

    public void setProjectRole(ProjectRole role) {
        this.projectRole = role;
    }
        
}
