/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member;

import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.member.ProjectRole;
import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 */
public class MemberResource extends ResourceSupport{

    private final Member member; 
    
    public MemberResource(Member member) {
        this.member = member;
    }
    
    public String getUsername() {
        return this.member.getUser().getUsername();
    }
    
    public ProjectRole getProjectRole() {
        return this.member.getProjectRole();
    }
        
}
