/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user.memberof;

import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.member.ProjectRole;
import org.springframework.hateoas.ResourceSupport;

/**
 *
 * @author ben
 */
public class MemberOfResource extends ResourceSupport {

    private final Member member;

    public MemberOfResource(Member member) {
        this.member = member;
    }

    public String getProjectName() {
        return this.member.getProject().getName();
    }

    public ProjectRole getProjectRole() {
        return this.member.getProjectRole();
    }
}
